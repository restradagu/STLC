import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import aiService from '../../services/aiService';
import PlanningWizard from './PlanningWizard';
import TestPlanViewer from './TestPlanViewer';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Clipboard, 
  Brain, 
  Eye, 
  CheckCircle,
  ArrowLeft,
  Download,
  FileText
} from 'lucide-react';

const Phase2 = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState('configure'); // configure, generate, review
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const phaseData = state.phases.planning.data;
  const requirementsData = state.phases.requirements.data;

  useEffect(() => {
    // If there's existing plan data, go directly to review
    if (phaseData.generatedPlan) {
      setGeneratedPlan(phaseData.generatedPlan);
      setCurrentStep('review');
    }
  }, [phaseData.generatedPlan]);

  const handleWizardComplete = async (formData) => {
    setWizardData(formData);
    await generateTestPlan(formData);
  };

  const generateTestPlan = async (formData) => {
    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      // Prepare project information for AI
      const projectInfo = {
        ...formData,
        requirements: requirementsData.requirements || [],
        projectName: formData.projectName
      };

      // Generate test plan with AI
      const plan = await aiService.generateTestPlan(projectInfo);
      
      setGeneratedPlan(plan);
      
      // Update app state
      actions.updatePhaseData('planning', {
        ...formData,
        generatedPlan: plan,
        sections: plan
      });

      // Update progress
      actions.updatePhaseProgress('planning', 100);
      
      setCurrentStep('review');
      actions.addNotification('success', 'Test plan generated successfully!');
      
    } catch (error) {
      console.error('Plan generation error:', error);
      actions.addError('Failed to generate test plan. Please try again.');
      setCurrentStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPlan = () => {
    if (!generatedPlan) return;

    // Create exportable content
    const content = {
      title: 'Test Plan',
      generated_date: new Date().toISOString(),
      plan: generatedPlan
    };

    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    actions.addNotification('success', 'Test plan exported successfully!');
  };

  const handleApprovePlan = () => {
    actions.updatePhaseProgress('planning', 100);
    actions.addNotification('success', 'Test plan approved! Moving to next phase.');
    actions.setCurrentPhase('testcases');
  };

  const handleBackToWizard = () => {
    setCurrentStep('configure');
  };

  const renderConfigureStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Clipboard className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Planning Configuration</h2>
        <p className="text-gray-600">
          Configure your test planning parameters to generate a comprehensive test plan with AI
        </p>
      </div>

      {/* Requirements Summary */}
      {requirementsData.requirements && requirementsData.requirements.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
          <p className="text-sm text-gray-600 mt-4">
            AI will use these requirements to generate context-aware test plans
          </p>
        </div>
      )}

      {/* Planning Wizard */}
      <PlanningWizard
        onComplete={handleWizardComplete}
        existingData={phaseData}
      />
    </div>
  );

  const renderGenerateStep = () => (
    <div className="text-center py-12">
      <LoadingSpinner size="large" message="AI is generating your test plan..." />
      <div className="mt-8 space-y-2">
        <p className="text-gray-600">• Analyzing project requirements and scope</p>
        <p className="text-gray-600">• Designing comprehensive test strategy</p>
        <p className="text-gray-600">• Calculating resource requirements and timeline</p>
        <p className="text-gray-600">• Identifying risks and mitigation strategies</p>
        <p className="text-gray-600">• Generating professional test plan document</p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToWizard}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configuration</span>
        </button>
        
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Plan Generated
          </span>
        </div>
      </div>

      {/* Test Plan Viewer */}
      {generatedPlan && (
        <TestPlanViewer
          testPlan={generatedPlan}
          onExport={handleExportPlan}
          onApprove={handleApprovePlan}
        />
      )}
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
            { id: 'configure', name: 'Configure', icon: Clipboard },
            { id: 'generate', name: 'Generate', icon: Brain },
            { id: 'review', name: 'Review', icon: Eye }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = (currentStep === 'review' && step.id !== 'review') || 
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
      {currentStep === 'review' && renderReviewStep()}
    </div>
  );
};

export default Phase2;