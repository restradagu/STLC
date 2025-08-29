import React, { useState } from 'react';
import { Plus, FileText, Save, X } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const ManualRequirementForm = ({ onAdd, onCancel, existingRequirements = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userStory: '',
    acceptanceCriteria: [''],
    type: 'functional',
    priority: 'medium',
    category: '',
    source: 'manual',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const generateId = () => {
    const existingIds = existingRequirements.map(r => r.id);
    const baseId = formData.type === 'functional' ? 'FR' : 'NFR';
    let counter = 1;
    let newId = `${baseId}-${counter.toString().padStart(3, '0')}`;
    
    while (existingIds.includes(newId)) {
      counter++;
      newId = `${baseId}-${counter.toString().padStart(3, '0')}`;
    }
    
    return newId;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAcceptanceCriteriaChange = (index, value) => {
    const newCriteria = [...formData.acceptanceCriteria];
    newCriteria[index] = value;
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: newCriteria
    }));
  };

  const addAcceptanceCriteria = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }));
  };

  const removeAcceptanceCriteria = (index) => {
    if (formData.acceptanceCriteria.length > 1) {
      const newCriteria = formData.acceptanceCriteria.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        acceptanceCriteria: newCriteria
      }));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in the title and description fields.');
      return;
    }

    const newRequirement = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      user_story: formData.userStory.trim(),
      acceptance_criteria: formData.acceptanceCriteria
        .filter(criteria => criteria.trim())
        .map(criteria => criteria.trim()),
      type: formData.type,
      priority: formData.priority,
      category: formData.category.trim() || 'General',
      source: 'manual',
      risk_level: formData.priority === 'critical' ? 'high' : 
                  formData.priority === 'high' ? 'medium' : 'low',
      tags: formData.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onAdd(newRequirement);
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900">Add Requirement Manually</h3>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter requirement title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Authentication, UI/UX, Performance"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            className="input-field h-24"
            placeholder="Describe the requirement in detail"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>

        {/* User Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Story
            <Tooltip content="Format: As a [user type], I want [goal] so that [reason]" position="right">
              <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
            </Tooltip>
          </label>
          <textarea
            className="input-field h-20"
            placeholder="As a [user type], I want [goal] so that [reason]"
            value={formData.userStory}
            onChange={(e) => handleInputChange('userStory', e.target.value)}
          />
        </div>

        {/* Acceptance Criteria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acceptance Criteria
            <Tooltip content="Define specific conditions that must be met for this requirement to be considered complete" position="right">
              <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
            </Tooltip>
          </label>
          <div className="space-y-2">
            {formData.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Given/When/Then statement ${index + 1}`}
                    value={criteria}
                    onChange={(e) => handleAcceptanceCriteriaChange(index, e.target.value)}
                  />
                </div>
                {formData.acceptanceCriteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAcceptanceCriteria(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAcceptanceCriteria}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Acceptance Criteria</span>
            </button>
          </div>
        </div>

        {/* Type and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              className="input-field"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="functional">Functional</option>
              <option value="non-functional">Non-Functional</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              className="input-field"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Add Requirement</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualRequirementForm;