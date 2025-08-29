import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import aiService from '../../services/aiService';
import exportService from '../../services/exportService';
import TestCaseConfiguration from './TestCaseConfiguration';
import TestCaseTable from './TestCaseTable';
import TestCaseEditModal from './TestCaseEditModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  TestTube, 
  Brain, 
  TableProperties,
  CheckCircle,
  ArrowLeft,
  Download,
  BarChart3,
  ChevronDown
} from 'lucide-react';

const Phase3 = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState('configure'); // configure, select, generate, manage
  const [isGenerating, setIsGenerating] = useState(false);
  const [, setGenerationResults] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [configurationData, setConfigurationData] = useState(null);

  const phaseData = state.phases.testcases.data;
  const requirementsData = state.phases.requirements.data;

  useEffect(() => {
    // If there are existing test cases, go directly to management
    if (phaseData.testCases && phaseData.testCases.length > 0) {
      setCurrentStep('manage');
    }
  }, [phaseData.testCases]);

  const handleConfigurationComplete = async (config) => {
    setConfigurationData(config);
    // Initialize all requirements as selected
    setSelectedRequirements(requirementsData.requirements?.map(req => req.id) || []);
    setCurrentStep('select');
  };

  const handleRequirementSelection = async () => {
    const filteredRequirements = requirementsData.requirements?.filter(req => 
      selectedRequirements.includes(req.id)
    ) || [];

    if (filteredRequirements.length === 0) {
      actions.addError('Please select at least one requirement to generate test cases.');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      // Generate test cases with AI using only selected requirements
      const results = await aiService.generateTestCases(
        filteredRequirements,
        configurationData
      );
      
      setGenerationResults(results);
      
      // Update app state
      actions.updatePhaseData('testcases', {
        testCases: results.test_cases,
        configuration: configurationData,
        selectedRequirements: selectedRequirements,
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
      actions.addNotification('success', `Generated ${results.test_cases.length} test cases from ${filteredRequirements.length} selected requirements!`);
      
    } catch (error) {
      console.error('Test case generation error:', error);
      actions.addError('Failed to generate test cases. Please try again.');
      setCurrentStep('select');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditTestCase = (testCase) => {
    setEditingTestCase(testCase);
    setShowEditModal(true);
  };

  const handleViewTestCase = (testCase) => {
    // For now, just open in edit mode as read-only
    setEditingTestCase(testCase);
    setShowEditModal(true);
  };

  const handleAddTestCase = () => {
    setEditingTestCase(null);
    setShowEditModal(true);
  };

  const handleDeleteTestCase = (testCase) => {
    if (window.confirm(`Are you sure you want to delete test case "${testCase.title}"?`)) {
      const updatedTestCases = phaseData.testCases.filter(tc => tc.id !== testCase.id);
      
      // Update statistics
      const statistics = {
        total: updatedTestCases.length,
        byPriority: {
          high: updatedTestCases.filter(tc => tc.priority === 'high').length,
          medium: updatedTestCases.filter(tc => tc.priority === 'medium').length,
          low: updatedTestCases.filter(tc => tc.priority === 'low').length
        },
        byType: {
          positive: updatedTestCases.filter(tc => tc.type === 'positive').length,
          negative: updatedTestCases.filter(tc => tc.type === 'negative').length,
          boundary: updatedTestCases.filter(tc => tc.type === 'boundary').length
        }
      };

      actions.updatePhaseData('testcases', {
        ...phaseData,
        testCases: updatedTestCases,
        statistics
      });

      actions.addNotification('success', 'Test case deleted successfully');
    }
  };

  const handleSaveTestCase = (testCaseData) => {
    const updatedTestCases = [...phaseData.testCases];
    
    if (editingTestCase) {
      // Update existing test case
      const index = updatedTestCases.findIndex(tc => tc.id === editingTestCase.id);
      if (index !== -1) {
        updatedTestCases[index] = { ...testCaseData };
        actions.addNotification('success', 'Test case updated successfully');
      }
    } else {
      // Add new test case
      const newId = `TC-${String(updatedTestCases.length + 1).padStart(3, '0')}`;
      updatedTestCases.push({ 
        ...testCaseData, 
        id: testCaseData.id || newId 
      });
      actions.addNotification('success', 'Test case added successfully');
    }

    // Update statistics
    const statistics = {
      total: updatedTestCases.length,
      byPriority: {
        high: updatedTestCases.filter(tc => tc.priority === 'high').length,
        medium: updatedTestCases.filter(tc => tc.priority === 'medium').length,
        low: updatedTestCases.filter(tc => tc.priority === 'low').length
      },
      byType: {
        positive: updatedTestCases.filter(tc => tc.type === 'positive').length,
        negative: updatedTestCases.filter(tc => tc.type === 'negative').length,
        boundary: updatedTestCases.filter(tc => tc.type === 'boundary').length
      }
    };

    actions.updatePhaseData('testcases', {
      ...phaseData,
      testCases: updatedTestCases,
      statistics
    });

    setShowEditModal(false);
    setEditingTestCase(null);
  };

  const handleBulkAction = (action, selectedIds) => {
    const updatedTestCases = [...phaseData.testCases];
    
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} test cases?`)) {
        const filteredTestCases = updatedTestCases.filter(tc => !selectedIds.includes(tc.id));
        
        // Update statistics
        const statistics = {
          total: filteredTestCases.length,
          byPriority: {
            high: filteredTestCases.filter(tc => tc.priority === 'high').length,
            medium: filteredTestCases.filter(tc => tc.priority === 'medium').length,
            low: filteredTestCases.filter(tc => tc.priority === 'low').length
          },
          byType: {
            positive: filteredTestCases.filter(tc => tc.type === 'positive').length,
            negative: filteredTestCases.filter(tc => tc.type === 'negative').length,
            boundary: filteredTestCases.filter(tc => tc.type === 'boundary').length
          }
        };

        actions.updatePhaseData('testcases', {
          ...phaseData,
          testCases: filteredTestCases,
          statistics
        });

        actions.addNotification('success', `${selectedIds.length} test cases deleted successfully`);
      }
    } else {
      actions.addNotification('success', `Bulk ${action} applied to ${selectedIds.length} test cases`);
    }
  };

  const handleExportTestCases = async (format) => {
    if (!phaseData.testCases || phaseData.testCases.length === 0) {
      actions.addError('No test cases to export');
      return;
    }

    setShowExportDropdown(false);
    const projectName = phaseData.configuration?.projectName || 'STLC Project';
    
    try {
      let result;
      switch (format) {
        case 'excel':
          result = await exportService.exportTestCasesToExcel(phaseData, projectName);
          break;
        case 'azure':
          result = exportService.exportTestCasesToAzureCSV(phaseData, projectName);
          break;
        case 'testlink':
          result = exportService.exportTestCasesToTestLinkCSV(phaseData, projectName);
          break;
        case 'zephyr':
          result = exportService.exportTestCasesToZephyrCSV(phaseData, projectName);
          break;
        default:
          result = { success: false, error: 'Unknown format' };
      }

      if (result.success) {
        actions.addNotification('success', `Test cases exported to ${format.toUpperCase()} successfully!`);
      } else {
        actions.addError(`Failed to export to ${format}: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      actions.addError(`Export failed: ${error.message}`);
    }
  };

  const handleCompletePhase = () => {
    actions.updatePhaseProgress('testcases', 100);
    actions.addNotification('success', 'Test case development phase completed!');
    // Note: In a real app, this might navigate to Phase 4 or show completion
  };

  const handleBackToConfiguration = () => {
    setCurrentStep('configure');
  };

  const handleBackToSelection = () => {
    setCurrentStep('select');
  };

  const handleToggleRequirement = (reqId) => {
    setSelectedRequirements(prev => 
      prev.includes(reqId) 
        ? prev.filter(id => id !== reqId)
        : [...prev, reqId]
    );
  };

  const handleToggleAll = () => {
    const allReqIds = requirementsData.requirements?.map(req => req.id) || [];
    if (selectedRequirements.length === allReqIds.length) {
      setSelectedRequirements([]);
    } else {
      setSelectedRequirements(allReqIds);
    }
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

  const renderSelectStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Requirements</h2>
        <p className="text-gray-600">
          Choose which requirements to include in test case generation
        </p>
      </div>

      {/* Selection Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Requirements Selection ({selectedRequirements.length} of {requirementsData.requirements?.length || 0} selected)
          </h3>
          <button
            onClick={handleToggleAll}
            className="btn-secondary text-sm"
          >
            {selectedRequirements.length === (requirementsData.requirements?.length || 0) ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        {/* Requirements List */}
        {requirementsData.requirements && requirementsData.requirements.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requirementsData.requirements.map((req) => (
              <div 
                key={req.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRequirements.includes(req.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToggleRequirement(req.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedRequirements.includes(req.id)}
                    onChange={() => handleToggleRequirement(req.id)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {req.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          req.type === 'functional' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {req.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          req.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : req.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {req.description}
                    </p>
                    {req.category && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Category: {req.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p>No requirements available</p>
            <p className="text-sm">Complete Phase 1 to analyze requirements first</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBackToConfiguration}
          className="btn-secondary flex items-center space-x-2"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          <span>Back to Configuration</span>
        </button>
        
        <button
          onClick={handleRequirementSelection}
          disabled={selectedRequirements.length === 0}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TestTube className="w-4 h-4" />
          <span>Generate Test Cases ({selectedRequirements.length} requirements)</span>
        </button>
      </div>
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
          onClick={handleBackToSelection}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selection</span>
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
          onDelete={handleDeleteTestCase}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Test Cases</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showExportDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExportTestCases('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExportTestCases('azure')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV Azure Test Plans</span>
                  </button>
                  <button
                    onClick={() => handleExportTestCases('testlink')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV TestLink</span>
                  </button>
                  <button
                    onClick={() => handleExportTestCases('zephyr')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV Zephyr Jira</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
        <div className="flex items-center justify-center space-x-4">
          {[
            { id: 'configure', name: 'Configure', icon: TestTube },
            { id: 'select', name: 'Select', icon: CheckCircle },
            { id: 'generate', name: 'Generate', icon: Brain },
            { id: 'manage', name: 'Manage', icon: TableProperties }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const getStepStatus = (stepId) => {
              const stepOrder = ['configure', 'select', 'generate', 'manage'];
              const currentIndex = stepOrder.indexOf(currentStep);
              const stepIndex = stepOrder.indexOf(stepId);
              return stepIndex < currentIndex;
            };
            const isCompleted = getStepStatus(step.id);
            
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
                <span className={`ml-2 font-medium text-sm ${
                  isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < 3 && <div className="w-4 h-0.5 bg-gray-300 mx-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'configure' && renderConfigureStep()}
      {currentStep === 'select' && renderSelectStep()}
      {currentStep === 'manage' && renderManageStep()}

      {/* Edit Modal */}
      <TestCaseEditModal
        isOpen={showEditModal}
        testCase={editingTestCase}
        onSave={handleSaveTestCase}
        onClose={() => {
          setShowEditModal(false);
          setEditingTestCase(null);
        }}
      />
    </div>
  );
};

export default Phase3;