import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import aiService from '../../services/aiService';
import TestCaseConfiguration from './TestCaseConfiguration';
import TestCaseTable from './TestCaseTable';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  TestTube, 
  Brain, 
  TableProperties,
  CheckCircle,
  ArrowLeft,
  Download,
  BarChart3
} from 'lucide-react';

const Phase3 = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState('configure'); // configure, generate, manage
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState(null);

  const phaseData = state.phases.testcases.data;
  const requirementsData = state.phases.requirements.data;

  useEffect(() => {
    // If there are existing test cases, go directly to management
    if (phaseData.testCases && phaseData.testCases.length > 0) {
      setCurrentStep('manage');
    }
  }, [phaseData.testCases]);

  const handleConfigurationComplete = async (config) => {
    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      // Generate test cases with AI
      const results = await aiService.generateTestCases(
        requirementsData.requirements || [],
        config
      );
      
      setGenerationResults(results);
      
      // Update app state
      actions.updatePhaseData('testcases', {
        testCases: results.test_cases,
        configuration: config,
        statistics: {
          total: results.test_cases.length,
          byPriority: {
            high: results.test_cases.filter(tc => tc.priority === 'high').length,
            medium: results.test_cases.filter(tc => tc.priority === 'medium').length,
            low: results.test_cases.filter(tc => tc.priority === 'low').length
          },
          byStatus: {
            draft: results.test_cases.filter(tc => tc.status === 'draft').length,
            review: results.test_cases.filter(tc => tc.status === 'review').length,
            approved: results.test_cases.filter(tc => tc.status === 'approved').length
          },
          byType: {
            positive: results.test_cases.filter(tc => tc.type === 'positive').length,
            negative: results.test_cases.filter(tc => tc.type === 'negative').length,
            boundary: results.test_cases.filter(tc => tc.type === 'boundary').length
          }
        },
        generationSummary: results.summary,
        recommendations: results.recommendations
      });

      // Update progress
      actions.updatePhaseProgress('testcases', 100);
      
      setCurrentStep('manage');
      actions.addNotification('success', `Generated ${results.test_cases.length} test cases successfully!`);
      
    } catch (error) {
      console.error('Test case generation error:', error);
      actions.addError('Failed to generate test cases. Please try again.');
      setCurrentStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditTestCase = (testCase) => {
    // TODO: Implement test case editing modal
    console.log('Edit test case:', testCase);
    actions.addNotification('info', 'Test case editor will open here');
  };

  const handleViewTestCase = (testCase) => {
    // TODO: Implement test case viewing modal
    console.log('View test case:', testCase);
    actions.addNotification('info', 'Test case details will be shown here');
  };

  const handleAddTestCase = () => {
    // TODO: Implement add test case modal
    console.log('Add new test case');
    actions.addNotification('info', 'Add test case form will open here');
  };

  const handleExecuteTestCase = (testCase) => {
    // TODO: Implement test case execution
    console.log('Execute test case:', testCase);
    actions.addNotification('info', 'Test execution will be implemented');
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds);
    actions.addNotification('success', `Bulk ${action} applied to ${selectedIds.length} test cases`);
  };

  const handleExportTestCases = () => {
    if (!phaseData.testCases || phaseData.testCases.length === 0) return;

    // Create exportable content
    const content = {
      title: 'Test Cases Suite',
      generated_date: new Date().toISOString(),
      statistics: phaseData.statistics,
      test_cases: phaseData.testCases,
      configuration: phaseData.configuration,
      recommendations: phaseData.recommendations
    };

    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-cases-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    actions.addNotification('success', 'Test cases exported successfully!');
  };

  const handleCompletePhase = () => {
    actions.updatePhaseProgress('testcases', 100);
    actions.addNotification('success', 'Test case development phase completed!');
    // Note: In a real app, this might navigate to Phase 4 or show completion
  };

  const handleBackToConfiguration = () => {
    setCurrentStep('configure');
  };

  const renderConfigureStep = () => (
    <div className="space-y-6">
      {/* Requirements Summary */}
      {requirementsData.requirements && requirementsData.requirements.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {requirementsData.requirements.length}
              </div>
              <div className="text-sm text-gray-600">Total Requirements</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {requirementsData.functionalCount || 0}
              </div>
              <div className="text-sm text-gray-600">Functional</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {requirementsData.nonFunctionalCount || 0}
              </div>
              <div className="text-sm text-gray-600">Non-Functional</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {requirementsData.riskCount || 0}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            AI will generate test cases based on these requirements and your configuration
          </p>
        </div>
      )}

      {/* Configuration Component */}
      <TestCaseConfiguration
        onGenerate={handleConfigurationComplete}
        existingConfig={phaseData.configuration}
      />
    </div>
  );

  const renderGenerateStep = () => (
    <div className="text-center py-12">
      <LoadingSpinner size="large" message="AI is generating your test cases..." />
      <div className="mt-8 space-y-2">
        <p className="text-gray-600">• Analyzing requirements and creating test scenarios</p>
        <p className="text-gray-600">• Generating positive, negative, and boundary test cases</p>
        <p className="text-gray-600">• Creating realistic test data and validation steps</p>
        <p className="text-gray-600">• Estimating execution times and automation potential</p>
        <p className="text-gray-600">• Organizing test cases by priority and type</p>
      </div>
    </div>
  );

  const renderManageStep = () => (
    <div className="space-y-6">
      {/* Navigation and Summary */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToConfiguration}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configuration</span>
        </button>
        
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {phaseData.testCases?.length || 0} Test Cases Generated
          </span>
        </div>
      </div>

      {/* Generation Summary */}
      {phaseData.generationSummary && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">
                {phaseData.generationSummary.total_generated}
              </div>
              <div className="text-sm text-gray-600">Total Generated</div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">By Type</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Positive:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_type?.positive || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Negative:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_type?.negative || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Boundary:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_type?.boundary || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">By Priority</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>High:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_priority?.high || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Medium:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_priority?.medium || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Low:</span>
                  <span className="font-medium">{phaseData.generationSummary.by_priority?.low || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {phaseData.recommendations && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">AI Recommendations</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {phaseData.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Test Cases Table */}
      {phaseData.testCases && (
        <TestCaseTable
          testCases={phaseData.testCases}
          onEdit={handleEditTestCase}
          onView={handleViewTestCase}
          onAdd={handleAddTestCase}
          onExecute={handleExecuteTestCase}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex space-x-4">
          <button
            onClick={handleExportTestCases}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Test Suite</span>
          </button>
        </div>
        
        <button
          onClick={handleCompletePhase}
          className="btn-primary flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete Phase 3</span>
        </button>
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {renderGenerateStep()}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { id: 'configure', name: 'Configure', icon: TestTube },
            { id: 'generate', name: 'Generate', icon: Brain },
            { id: 'manage', name: 'Manage', icon: TableProperties }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = (currentStep === 'manage' && step.id !== 'manage') || 
                             (currentStep === 'generate' && step.id === 'configure');
            
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
      {currentStep === 'configure' && renderConfigureStep()}
      {currentStep === 'manage' && renderManageStep()}
    </div>
  );
};

export default Phase3;