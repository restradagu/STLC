import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import aiService from '../../services/aiService';
import FileUpload from './FileUpload';
import RequirementsTable from './RequirementsTable';
import ManualRequirementForm from './ManualRequirementForm';
import StaticValidation from './StaticValidation';
import LoadingSpinner from '../common/LoadingSpinner';
import Stepper from '../common/Stepper';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Download,
  BarChart3,
  Users,
  Target,
  Plus,
  Shield,
  Eye
} from 'lucide-react';

const Phase1 = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyze, review
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [businessContext, setBusinessContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisResults] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [manualRequirements, setManualRequirements] = useState([]);

  const phaseData = state.phases.requirements.data;

  const handleFileSelect = (fileId, fileData) => {
    if (fileData === null) {
      // File removed
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    } else {
      // File added/updated
      setUploadedFiles(prev => {
        const existing = prev.find(f => f.id === fileId);
        if (existing) {
          return prev.map(f => f.id === fileId ? fileData : f);
        } else {
          return [...prev, fileData];
        }
      });
    }
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0 && !businessContext.trim() && manualRequirements.length === 0) {
      alert('Please upload files, provide business context, or add manual requirements before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let analysis;

      if (manualRequirements.length > 0 && (uploadedFiles.length === 0 && !businessContext.trim())) {
        // Only manual requirements - use them directly
        analysis = {
          requirements: manualRequirements,
          quality_metrics: {
            total_requirements: manualRequirements.length,
            functional_count: manualRequirements.filter(r => r.type === 'functional').length,
            non_functional_count: manualRequirements.filter(r => r.type === 'non-functional').length,
            quality_score: 90,
            completeness_score: 85,
            clarity_score: 88,
            testability_score: 87
          },
          validation_results: { errors: [], warnings: [], suggestions: [] },
          stakeholders: ['Product Manager', 'Development Team', 'QA Team', 'Business Analyst'],
          business_drivers: ['Improve user experience', 'Enhance system functionality', 'Meet business requirements'],
          estimated_effort: { development_weeks: 8, testing_weeks: 3, total_story_points: 65 },
          risk_assessment: {
            high_risk_count: manualRequirements.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length,
            medium_risk_count: manualRequirements.filter(r => r.risk_level === 'medium').length,
            low_risk_count: manualRequirements.filter(r => r.risk_level === 'low').length
          }
        };
      } else {
        // AI analysis with files/context
        const combinedContent = uploadedFiles
          .filter(f => f.content)
          .map(f => `File: ${f.name}\n${f.content}`)
          .join('\n\n');

        const content = combinedContent || businessContext;
        analysis = await aiService.analyzeRequirements(content, businessContext);

        // Merge with manual requirements if any
        if (manualRequirements.length > 0) {
          analysis.requirements = [...analysis.requirements, ...manualRequirements];
          analysis.quality_metrics.total_requirements += manualRequirements.length;
          analysis.quality_metrics.functional_count += manualRequirements.filter(r => r.type === 'functional').length;
          analysis.quality_metrics.non_functional_count += manualRequirements.filter(r => r.type === 'non-functional').length;
        }
      }
      
      setAnalysisResults(analysis);
      
      // Automatically run static validation after analysis
      setIsValidating(true);
      try {
        const allRequirements = [...analysis.requirements, ...manualRequirements];
        const requirementsForValidation = allRequirements.map(req => ({
          id: req.id,
          title: req.title,
          description: req.description,
          user_story: req.user_story,
          acceptance_criteria: req.acceptance_criteria,
          type: req.type,
          priority: req.priority
        }));

        const validation = await aiService.validateRequirements(requirementsForValidation);
        setValidationResults(validation);
        
        // Update app state with both analysis and validation results
        actions.updatePhaseData('requirements', {
          requirements: analysis.requirements,
          functionalCount: analysis.quality_metrics.functional_count,
          nonFunctionalCount: analysis.quality_metrics.non_functional_count,
          qualityScore: analysis.quality_metrics.quality_score,
          riskCount: analysis.risk_assessment.high_risk_count,
          stakeholders: analysis.stakeholders,
          businessDrivers: analysis.business_drivers,
          uploadedFiles: uploadedFiles,
          manualRequirements: manualRequirements,
          analysisResults: analysis,
          validationResults: validation
        });

        // Update progress
        actions.updatePhaseProgress('requirements', 75);
        
        setCurrentStep('review');
        actions.addNotification('success', 'Requirements analyzed and validated successfully!');
        
      } catch (validationError) {
        console.error('Validation error:', validationError);
        actions.addError('Requirements analyzed but validation failed. You can proceed to review.');
        
        // Still update app state with analysis results
        actions.updatePhaseData('requirements', {
          requirements: analysis.requirements,
          functionalCount: analysis.quality_metrics.functional_count,
          nonFunctionalCount: analysis.quality_metrics.non_functional_count,
          qualityScore: analysis.quality_metrics.quality_score,
          riskCount: analysis.risk_assessment.high_risk_count,
          stakeholders: analysis.stakeholders,
          businessDrivers: analysis.business_drivers,
          uploadedFiles: uploadedFiles,
          manualRequirements: manualRequirements,
          analysisResults: analysis
        });

        actions.updatePhaseProgress('requirements', 50);
        setCurrentStep('review');
      } finally {
        setIsValidating(false);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      actions.addError('Failed to analyze requirements. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompletePhase = () => {
    actions.updatePhaseProgress('requirements', 100);
    actions.addNotification('success', 'Requirements analysis phase completed!');
    actions.setCurrentPhase('planning');
  };

  const handleEditRequirement = (requirement) => {
    // TODO: Implement requirement editing modal
    console.log('Edit requirement:', requirement);
  };

  const handleViewRequirement = (requirement) => {
    // TODO: Implement requirement viewing modal
    console.log('View requirement:', requirement);
  };

  const handleAddRequirement = () => {
    setShowManualForm(true);
  };

  const handleAddManualRequirement = (requirement) => {
    setManualRequirements(prev => [...prev, requirement]);
    setShowManualForm(false);
    actions.addNotification('success', 'Requirement added successfully!');
  };

  const handleCancelManualForm = () => {
    setShowManualForm(false);
  };


  const getAllRequirements = () => {
    const aiRequirements = phaseData.requirements || [];
    return [...aiRequirements, ...manualRequirements];
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gather Requirements</h2>
        <p className="text-gray-600">
          Upload documents, provide business context, or manually input requirements for AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        {/* Business Context */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Context</h3>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe your project's business context, goals, and key requirements..."
            value={businessContext}
            onChange={(e) => setBusinessContext(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Provide context about your project to help AI generate better analysis
          </p>
        </div>
      </div>

      {/* Manual Requirements Section */}
      {showManualForm ? (
        <ManualRequirementForm 
          onAdd={handleAddManualRequirement}
          onCancel={handleCancelManualForm}
          existingRequirements={getAllRequirements()}
        />
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Manual Requirements</h3>
            <button
              onClick={() => setShowManualForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Requirement</span>
            </button>
          </div>
          
          {manualRequirements.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                {manualRequirements.length} manual requirement{manualRequirements.length !== 1 ? 's' : ''} added:
              </p>
              {manualRequirements.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{req.title}</div>
                    <div className="text-sm text-gray-600">
                      {req.type} • {req.priority} priority
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                    {req.id}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No manual requirements added yet</p>
              <p className="text-sm">Click "Add Requirement" to create requirements manually</p>
            </div>
          )}
        </div>
      )}

      {(uploadedFiles.length > 0 || businessContext.trim() || manualRequirements.length > 0) && (
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary px-8 py-3 text-lg"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      )}
    </div>
  );

  const renderAnalyzeStep = () => (
    <div className="text-center py-12">
      <LoadingSpinner size="large" message={isValidating ? "Running static validation..." : "AI is analyzing your requirements..."} />
      <div className="mt-8 space-y-2">
        <p className="text-gray-600">• Extracting functional and non-functional requirements</p>
        <p className="text-gray-600">• Generating acceptance criteria in BDD format</p>
        <p className="text-gray-600">• Identifying stakeholders and business drivers</p>
        <p className="text-gray-600">• Performing quality validation and risk assessment</p>
        {isValidating && <p className="text-primary-600 font-medium">• Running static validation for errors and ambiguities</p>}
      </div>
    </div>
  );


  const renderReviewStep = () => {
    const allRequirements = getAllRequirements();
    const functionalCount = allRequirements.filter(r => r.type === 'functional').length;
    const nonFunctionalCount = allRequirements.filter(r => r.type === 'non-functional').length;
    const highRiskCount = allRequirements.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length;

    return (
      <div className="space-y-6">
        {/* Requirements Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <FileText className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{allRequirements.length}</div>
            <div className="text-sm text-gray-600">Total Requirements</div>
          </div>
          
          <div className="card text-center">
            <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{functionalCount}</div>
            <div className="text-sm text-gray-600">Functional</div>
          </div>
          
          <div className="card text-center">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{nonFunctionalCount}</div>
            <div className="text-sm text-gray-600">Non-Functional</div>
          </div>

          <div className="card text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{highRiskCount}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
        </div>


      {/* Static Requirements Validation */}
      {validationResults && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Static Requirements Validation</h3>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{validationResults.overall_score}%</div>
              <div className="text-sm text-blue-700">Quality Score</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{validationResults.summary?.critical_issues || 0}</div>
              <div className="text-sm text-red-700">Critical Issues</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{validationResults.summary?.warnings || 0}</div>
              <div className="text-sm text-orange-700">Warnings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{validationResults.summary?.suggestions || 0}</div>
              <div className="text-sm text-gray-700">Suggestions</div>
            </div>
          </div>

          {/* Detailed Findings */}
          {validationResults.findings && validationResults.findings.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-3">Detailed Findings</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {validationResults.findings.slice(0, 3).map((finding, index) => (
                  <div key={finding.id || index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {finding.type === 'error' ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : finding.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-medium text-gray-900">{finding.title}</h5>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            finding.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            finding.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{finding.description}</p>
                        {finding.requirement_id && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {finding.requirement_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {validationResults.findings.length > 3 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    + {validationResults.findings.length - 3} more findings...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Analysis Summary */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Static Validation Summary</h4>
                <div className="text-blue-800 text-sm">
                  <p>Analyzed {getAllRequirements().length} requirements for formal errors, ambiguities, and gaps. Overall quality score: {validationResults.overall_score}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Table */}
      {allRequirements.length > 0 && (
        <RequirementsTable
          requirements={allRequirements}
          onEdit={handleEditRequirement}
          onView={handleViewRequirement}
          onAdd={handleAddRequirement}
        />
      )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => setCurrentStep('upload')}
            className="btn-secondary"
          >
            Back to Gather
          </button>
          
          <div className="flex space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Analysis</span>
            </button>
            
            <button
              onClick={handleCompletePhase}
              className="btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Phase 1</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isAnalyzing || isValidating) {
    return renderAnalyzeStep();
  }

  const stepperSteps = [
    { id: 'upload', name: 'Gather', icon: Upload, description: 'Upload files or add manual requirements' },
    { id: 'analyze', name: 'Analyze', icon: Brain, description: 'AI analyzes and performs static validation' },
    { id: 'review', name: 'Review', icon: Eye, description: 'Review and approve final requirements' }
  ];

  const handleStepClick = (stepId) => {
    // Allow navigation to completed steps and current step
    const currentIndex = stepperSteps.findIndex(s => s.id === currentStep);
    const targetIndex = stepperSteps.findIndex(s => s.id === stepId);
    
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div>
      {/* Enhanced Progress Steps */}
      <div className="mb-8">
        <Stepper 
          steps={stepperSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          allowNonLinear={false}
        />
      </div>

      {/* Step Content */}
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'review' && renderReviewStep()}
    </div>
  );
};

export default Phase1;