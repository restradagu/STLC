import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const PlanningWizard = ({ onComplete, existingData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    projectName: existingData.projectName || '',
    projectDescription: existingData.projectDescription || '',
    testingObjective: existingData.testingObjective || '',
    
    // Step 2: Scope and Types
    inclusions: existingData.inclusions || [],
    exclusions: existingData.exclusions || [],
    testTypes: existingData.testTypes || [],
    
    // Step 3: Resources and Environment
    teamSize: existingData.teamSize || '',
    duration: existingData.duration || '',
    environments: existingData.environments || [],
    tools: existingData.tools || [],
    
    // Step 4: Risks and Success Criteria
    risks: existingData.risks || [],
    successCriteria: existingData.successCriteria || [],
    assumptions: existingData.assumptions || []
  });

  // Input states for array inputs
  const [inputValues, setInputValues] = useState({
    inclusions: '',
    exclusions: '',
    environments: '',
    tools: '',
    risks: '',
    successCriteria: '',
    assumptions: ''
  });

  const steps = [
    { title: 'Basic Info', fullTitle: 'Basic Information', description: 'Project details and objectives' },
    { title: 'Scope & Types', fullTitle: 'Scope & Types', description: 'Testing scope and test types' },
    { title: 'Resources', fullTitle: 'Resources & Environment', description: 'Team and infrastructure' },
    { title: 'Success Criteria', fullTitle: 'Risks & Success Criteria', description: 'Risk assessment and goals' }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field, item) => {
    if (item.trim()) {
      updateFormData(field, [...formData[field], item.trim()]);
    }
  };

  const removeArrayItem = (field, index) => {
    updateFormData(field, formData[field].filter((_, i) => i !== index));
  };

  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return formData.projectName && formData.projectDescription && formData.testingObjective;
      case 1:
        return formData.inclusions.length > 0 && formData.testTypes.length > 0;
      case 2:
        return formData.teamSize && formData.duration && formData.environments.length > 0;
      case 3:
        return formData.successCriteria.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderArrayInput = (field, placeholder, items) => {
    const handleInputChange = (value) => {
      setInputValues(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = () => {
      const value = inputValues[field];
      if (value.trim()) {
        addArrayItem(field, value);
        setInputValues(prev => ({ ...prev, [field]: '' }));
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddItem();
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={placeholder}
            value={inputValues[field] || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={formData.projectName}
          onChange={(e) => updateFormData('projectName', e.target.value)}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={4}
          value={formData.projectDescription}
          onChange={(e) => updateFormData('projectDescription', e.target.value)}
          placeholder="Describe the project and its key features"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Testing Objective *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          value={formData.testingObjective}
          onChange={(e) => updateFormData('testingObjective', e.target.value)}
          placeholder="What do you want to achieve with testing?"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Testing Inclusions *
        </label>
        <p className="text-sm text-gray-600 mb-3">What will be included in testing?</p>
        {renderArrayInput('inclusions', 'Enter testing inclusion', formData.inclusions)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Testing Exclusions
        </label>
        <p className="text-sm text-gray-600 mb-3">What will be excluded from testing?</p>
        {renderArrayInput('exclusions', 'Enter testing exclusion', formData.exclusions)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Types *
        </label>
        <p className="text-sm text-gray-600 mb-3">Select the types of testing to be performed</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Functional Testing',
            'API Testing',
            'Performance Testing',
            'Security Testing',
            'Usability Testing',
            'Compatibility Testing',
            'Integration Testing',
            'Regression Testing',
            'Smoke Testing'
          ].map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.testTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('testTypes', [...formData.testTypes, type]);
                  } else {
                    updateFormData('testTypes', formData.testTypes.filter(t => t !== type));
                  }
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Size *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.teamSize}
            onChange={(e) => updateFormData('teamSize', e.target.value)}
          >
            <option value="">Select team size</option>
            <option value="1-3">1-3 people</option>
            <option value="4-6">4-6 people</option>
            <option value="7-10">7-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Testing Duration *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.duration}
            onChange={(e) => updateFormData('duration', e.target.value)}
          >
            <option value="">Select duration</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="3-4 weeks">3-4 weeks</option>
            <option value="1-2 months">1-2 months</option>
            <option value="3+ months">3+ months</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Environments *
        </label>
        <p className="text-sm text-gray-600 mb-3">Environments where testing will be performed</p>
        {renderArrayInput('environments', 'Enter environment name', formData.environments)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Testing Tools
        </label>
        <p className="text-sm text-gray-600 mb-3">Tools to be used for testing</p>
        {renderArrayInput('tools', 'Enter tool name', formData.tools)}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Risks
        </label>
        <p className="text-sm text-gray-600 mb-3">Identify potential risks and challenges</p>
        {renderArrayInput('risks', 'Enter potential risk', formData.risks)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Success Criteria *
        </label>
        <p className="text-sm text-gray-600 mb-3">Define what constitutes successful testing</p>
        {renderArrayInput('successCriteria', 'Enter success criterion', formData.successCriteria)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assumptions
        </label>
        <p className="text-sm text-gray-600 mb-3">Key assumptions for the testing project</p>
        {renderArrayInput('assumptions', 'Enter assumption', formData.assumptions)}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1 min-w-0">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium shrink-0 ${
                index === currentStep
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : index < currentStep
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}>
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  index === currentStep ? 'text-primary-600' : index < currentStep ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 truncate hidden sm:block">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-8 lg:w-12 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile step indicator */}
        <div className="md:hidden mt-4 text-center">
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="text-base font-medium text-gray-900 mt-1">
            {steps[currentStep].fullTitle}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="card min-h-96">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {steps[currentStep].fullTitle}
        </h2>
        
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid(currentStep)}
          className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{currentStep === steps.length - 1 ? 'Generate Plan' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PlanningWizard;