import React, { useState } from 'react';
import { Settings, Play, Lightbulb, Target } from 'lucide-react';

const TestCaseConfiguration = ({ onGenerate, existingConfig = {} }) => {
  const [config, setConfig] = useState({
    includePositive: existingConfig.includePositive ?? true,
    includeNegative: existingConfig.includeNegative ?? true,
    includeBoundary: existingConfig.includeBoundary ?? true,
    testTypes: existingConfig.testTypes || ['functional'],
    complexity: existingConfig.complexity || 'medium',
    priorityDistribution: existingConfig.priorityDistribution || 'balanced',
    generateTestData: existingConfig.generateTestData ?? true,
    estimateExecutionTime: existingConfig.estimateExecutionTime ?? true
  });

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTestTypeToggle = (type) => {
    setConfig(prev => ({
      ...prev,
      testTypes: prev.testTypes.includes(type)
        ? prev.testTypes.filter(t => t !== type)
        : [...prev.testTypes, type]
    }));
  };

  const handleGenerate = () => {
    onGenerate(config);
  };

  const testTypeOptions = [
    { id: 'functional', name: 'Functional Testing', description: 'Test core business logic and features' },
    { id: 'ui', name: 'UI Testing', description: 'Test user interface elements and interactions' },
    { id: 'api', name: 'API Testing', description: 'Test backend services and data flow' },
    { id: 'performance', name: 'Performance Testing', description: 'Test response times and throughput' },
    { id: 'security', name: 'Security Testing', description: 'Test security vulnerabilities and access control' },
    { id: 'integration', name: 'Integration Testing', description: 'Test component interactions and data flow' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Case Configuration</h2>
        <p className="text-gray-600">
          Configure AI parameters to generate comprehensive test cases tailored to your requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Case Types */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Case Types</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.includePositive}
                onChange={(e) => handleConfigChange('includePositive', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-gray-900">Positive Test Cases</span>
                <p className="text-sm text-gray-600">Test expected behavior with valid inputs</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.includeNegative}
                onChange={(e) => handleConfigChange('includeNegative', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-gray-900">Negative Test Cases</span>
                <p className="text-sm text-gray-600">Test error handling with invalid inputs</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.includeBoundary}
                onChange={(e) => handleConfigChange('includeBoundary', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-gray-900">Boundary Test Cases</span>
                <p className="text-sm text-gray-600">Test edge conditions and limit values</p>
              </div>
            </label>
          </div>
        </div>

        {/* Testing Complexity */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Complexity</h3>
          <div className="space-y-3">
            {[
              { value: 'simple', label: 'Simple', description: 'Basic test cases, fewer scenarios' },
              { value: 'medium', label: 'Medium', description: 'Balanced coverage with moderate scenarios' },
              { value: 'comprehensive', label: 'Comprehensive', description: 'Extensive test cases, all scenarios' }
            ].map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="complexity"
                  value={option.value}
                  checked={config.complexity === option.value}
                  onChange={(e) => handleConfigChange('complexity', e.target.value)}
                  className="mt-1 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Test Types Selection */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Test Types to Generate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testTypeOptions.map((type) => (
            <label
              key={type.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                config.testTypes.includes(type.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={config.testTypes.includes(type.id)}
                onChange={() => handleTestTypeToggle(type.id)}
                className="sr-only"
              />
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  config.testTypes.includes(type.id)
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {config.testTypes.includes(type.id) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={config.priorityDistribution}
            onChange={(e) => handleConfigChange('priorityDistribution', e.target.value)}
          >
            <option value="balanced">Balanced (Equal distribution)</option>
            <option value="high-priority">High Priority Focus</option>
            <option value="critical-first">Critical Requirements First</option>
          </select>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI Enhancements</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.generateTestData}
                onChange={(e) => handleConfigChange('generateTestData', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-900">Generate realistic test data</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.estimateExecutionTime}
                onChange={(e) => handleConfigChange('estimateExecutionTime', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-900">Estimate execution time</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview and Generate */}
      <div className="card bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">Ready to Generate</h3>
              <p className="text-sm text-gray-600">
                AI will generate test cases based on your requirements and configuration
              </p>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={config.testTypes.length === 0}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>Generate Test Cases</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="card border-blue-200 bg-blue-50">
        <div className="flex space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">AI Generation Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• More test types = broader coverage but longer generation time</li>
              <li>• Comprehensive complexity provides thorough testing but more test cases</li>
              <li>• AI uses your requirements from Phase 1 to create contextual test cases</li>
              <li>• Generated test cases can be edited and customized after creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseConfiguration;