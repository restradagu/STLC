import React, { useState, useEffect } from 'react';
import { X, TestTube, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import Toast from './Toast';

const AzureConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState({
    apiKey: '',
    endpoint: '',
    apiVersion: '2024-02-15-preview',
    deploymentName: 'gpt-4o'
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadSavedConfig();
    }
  }, [isOpen]);

  const loadSavedConfig = () => {
    const savedConfig = sessionStorage.getItem('azure-openai-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  };

  const validateFields = () => {
    const newErrors = {};
    
    if (!config.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }
    
    if (!config.endpoint.trim()) {
      newErrors.endpoint = 'Endpoint is required';
    } else if (!config.endpoint.startsWith('https://')) {
      newErrors.endpoint = 'Endpoint must start with https://';
    }
    
    if (!config.apiVersion.trim()) {
      newErrors.apiVersion = 'API Version is required';
    }
    
    if (!config.deploymentName.trim()) {
      newErrors.deploymentName = 'Deployment Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async () => {
    if (!validateFields()) {
      setToast({
        type: 'error',
        message: 'Please fix validation errors before testing connection'
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      const response = await fetch(`${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${config.apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        setToast({
          type: 'success',
          message: 'Connection successful! Azure OpenAI is configured correctly.'
        });
      } else {
        const errorData = await response.json();
        setToast({
          type: 'error',
          message: `Connection failed: ${errorData.error?.message || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setToast({
        type: 'error',
        message: 'Connection failed: Network error or invalid configuration'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveConfiguration = () => {
    if (!validateFields()) {
      setToast({
        type: 'error',
        message: 'Please fix validation errors before saving'
      });
      return;
    }

    try {
      sessionStorage.setItem('azure-openai-config', JSON.stringify(config));
      setToast({
        type: 'success',
        message: 'Configuration saved successfully!'
      });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error saving config:', error);
      setToast({
        type: 'error',
        message: 'Failed to save configuration'
      });
    }
  };

  const resetToMock = () => {
    sessionStorage.removeItem('azure-openai-config');
    setConfig({
      apiKey: '',
      endpoint: '',
      apiVersion: '2024-02-15-preview',
      deploymentName: 'gpt-4o'
    });
    setErrors({});
    setToast({
      type: 'success',
      message: 'Reset to mock mode successfully!'
    });
    setTimeout(() => onClose(), 1500);
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Azure OpenAI Configuration</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your Azure OpenAI API key"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.apiKey ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.apiKey}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint
            </label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => handleInputChange('endpoint', e.target.value)}
              placeholder="https://your-resource.openai.azure.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.endpoint ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endpoint && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.endpoint}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Version
            </label>
            <input
              type="text"
              value={config.apiVersion}
              onChange={(e) => handleInputChange('apiVersion', e.target.value)}
              placeholder="2024-02-15-preview"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.apiVersion ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.apiVersion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.apiVersion}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deployment Name
            </label>
            <input
              type="text"
              value={config.deploymentName}
              onChange={(e) => handleInputChange('deploymentName', e.target.value)}
              placeholder="gpt-4o"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.deploymentName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deploymentName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.deploymentName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-b-lg space-x-3">
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </button>

          <div className="flex space-x-2">
            <button
              onClick={resetToMock}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Mock
            </button>
            <button
              onClick={saveConfiguration}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AzureConfigModal;