import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const TestCaseEditModal = ({ isOpen, testCase, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    type: 'positive',
    priority: 'medium',
    preconditions: [''],
    steps: [{ action: '', expected: '' }],
    expected_result: '',
    tags: ['']
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (testCase && isOpen) {
      setFormData({
        id: testCase.id || '',
        title: testCase.title || '',
        description: testCase.description || '',
        type: testCase.type || 'positive',
        priority: testCase.priority || 'medium',
        preconditions: testCase.preconditions && testCase.preconditions.length > 0 ? testCase.preconditions : [''],
        steps: testCase.steps && testCase.steps.length > 0 ? testCase.steps : [{ action: '', expected: '' }],
        expected_result: testCase.expected_result || '',
        tags: testCase.tags && testCase.tags.length > 0 ? testCase.tags : ['']
      });
      setHasChanges(false);
    }
  }, [testCase, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setHasChanges(true);
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
    setHasChanges(true);
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
      setHasChanges(true);
    }
  };

  const handleStepChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
    setHasChanges(true);
  };

  const addStep = () => {
    addArrayItem('steps', { action: '', expected: '' });
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }));
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    // Clean up data
    const cleanedData = {
      ...formData,
      preconditions: formData.preconditions.filter(item => item.trim() !== ''),
      steps: formData.steps.filter(step => step.action.trim() !== '' || step.expected.trim() !== ''),
      tags: formData.tags.filter(tag => tag.trim() !== '')
    };

    onSave(cleanedData);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, hasChanges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {testCase?.id ? `Edit Test Case #${testCase.id}` : 'Add New Test Case'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter test case title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="TC-001"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe what this test case validates"
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="boundary">Boundary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Preconditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preconditions
            </label>
            {formData.preconditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => handleArrayInputChange('preconditions', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter precondition"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('preconditions', index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  disabled={formData.preconditions.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('preconditions', '')}
              className="text-primary-600 hover:text-primary-800 flex items-center space-x-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Precondition</span>
            </button>
          </div>

          {/* Test Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Steps
            </label>
            {formData.steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Step {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    disabled={formData.steps.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Action
                    </label>
                    <textarea
                      value={step.action}
                      onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="What action to perform"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Expected Result
                    </label>
                    <textarea
                      value={step.expected}
                      onChange={(e) => handleStepChange(index, 'expected', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="What should happen"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="text-primary-600 hover:text-primary-800 flex items-center space-x-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step</span>
            </button>
          </div>

          {/* Expected Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Expected Result
            </label>
            <textarea
              value={formData.expected_result}
              onChange={(e) => handleInputChange('expected_result', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Overall expected outcome of the test case"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter tag"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  disabled={formData.tags.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags', '')}
              className="text-primary-600 hover:text-primary-800 flex items-center space-x-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tag</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || !formData.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseEditModal;