import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import aiService from '../../services/aiService';
import FileUpload from './FileUpload';
import RequirementsTable from './RequirementsTable';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Download,
  BarChart3,
  Users,
  Target
} from 'lucide-react';

const Phase1 = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyze, review
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [businessContext, setBusinessContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

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
    if (uploadedFiles.length === 0 && !businessContext.trim()) {
      alert('Please upload files or provide business context before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Combine all file contents
      const combinedContent = uploadedFiles
        .filter(f => f.content)
        .map(f => `File: ${f.name}\n${f.content}`)
        .join('\n\n');

      const content = combinedContent || businessContext;
      
      // Call AI service
      const analysis = await aiService.analyzeRequirements(content, businessContext);
      
      setAnalysisResults(analysis);
      
      // Update app state
      actions.updatePhaseData('requirements', {
        requirements: analysis.requirements,
        functionalCount: analysis.quality_metrics.functional_count,
        nonFunctionalCount: analysis.quality_metrics.non_functional_count,
        qualityScore: analysis.quality_metrics.quality_score,
        riskCount: analysis.risk_assessment.high_risk_count,
        stakeholders: analysis.stakeholders,
        businessDrivers: analysis.business_drivers,
        uploadedFiles: uploadedFiles,
        analysisResults: analysis
      });

      // Update progress
      actions.updatePhaseProgress('requirements', 50);
      
      setCurrentStep('review');
      actions.addNotification('success', 'Requirements analyzed successfully!');
      
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
    // TODO: Implement add requirement modal
    console.log('Add new requirement');
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Requirements</h2>
        <p className="text-gray-600">
          Upload your requirements documents or provide business context for AI analysis
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

      {(uploadedFiles.length > 0 || businessContext.trim()) && (
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
      <LoadingSpinner size="large" message="AI is analyzing your requirements..." />
      <div className="mt-8 space-y-2">
        <p className="text-gray-600">• Extracting functional and non-functional requirements</p>
        <p className="text-gray-600">• Generating acceptance criteria in BDD format</p>
        <p className="text-gray-600">• Identifying stakeholders and business drivers</p>
        <p className="text-gray-600">• Performing quality validation and risk assessment</p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{analysisResults?.quality_metrics.quality_score}%</div>
          <div className="text-sm text-gray-600">Quality Score</div>
        </div>
        
        <div className="card text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{analysisResults?.stakeholders.length}</div>
          <div className="text-sm text-gray-600">Stakeholders</div>
        </div>
        
        <div className="card text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{analysisResults?.business_drivers.length}</div>
          <div className="text-sm text-gray-600">Business Drivers</div>
        </div>
      </div>

      {/* Validation Results */}
      {analysisResults?.validation_results && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Validation Results</h3>
          <div className="space-y-4">
            {analysisResults.validation_results.errors?.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-800">Errors Found</h4>
                </div>
                {analysisResults.validation_results.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">{error.message}</p>
                ))}
              </div>
            )}
            
            {analysisResults.validation_results.suggestions?.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Suggestions</h4>
                </div>
                {analysisResults.validation_results.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-sm text-blue-700">{suggestion.message}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requirements Table */}
      {phaseData.requirements && (
        <RequirementsTable
          requirements={phaseData.requirements}
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
          Back to Upload
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

  if (isAnalyzing) {
    return renderAnalyzeStep();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { id: 'upload', name: 'Upload', icon: Upload },
            { id: 'analyze', name: 'Analyze', icon: Brain },
            { id: 'review', name: 'Review', icon: FileText }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep === 'review' && step.id !== 'review';
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : isCompleted 
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 font-medium ${
                  isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < 2 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'review' && renderReviewStep()}
    </div>
  );
};

export default Phase1;