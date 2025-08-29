import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Edit3, 
  Download, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  Target,
  Settings,
  CheckCircle
} from 'lucide-react';
import exportService from '../../services/exportService';
import { useApp } from '../../context/AppContext';

const TestPlanViewer = ({ testPlan, onEdit, onExport, onApprove }) => {
  const { actions } = useApp();
  const [activeTab, setActiveTab] = useState('preview');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    objective: true,
    scope: true,
    approach: false,
    schedule: false,
    resources: false,
    risks: false,
    tools: false,
    deliverables: false
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExport = async (format) => {
    setShowExportDropdown(false);
    const projectName = testPlan.project_name || 'STLC Project';
    
    try {
      let result;
      switch (format) {
        case 'pdf':
          result = exportService.exportTestPlanToPDF(testPlan, projectName);
          break;
        case 'word':
          result = await exportService.exportTestPlanToWord(testPlan, projectName);
          break;
        case 'txt':
          result = exportService.exportTestPlanToTxt(testPlan, projectName);
          break;
        default:
          result = { success: false, error: 'Unknown format' };
      }

      if (result.success) {
        actions.addNotification('success', `Test plan exported to ${format.toUpperCase()} successfully!`);
      } else {
        actions.addError(`Failed to export to ${format.toUpperCase()}: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      actions.addError(`Export failed: ${error.message}`);
    }
  };

  const renderSection = (title, content, icon, sectionKey) => {
    const Icon = icon;
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4">
            {content}
          </div>
        )}
      </div>
    );
  };

  const renderObjective = () => (
    <div className="prose max-w-none">
      <p className="text-gray-700">{testPlan.objective}</p>
    </div>
  );

  const renderScope = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Inclusions</h4>
        <ul className="space-y-2">
          {testPlan.scope.inclusions.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Exclusions</h4>
        <ul className="space-y-2">
          {testPlan.scope.exclusions.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-4 h-4 border-2 border-red-300 rounded mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderApproach = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Strategy</h4>
        <p className="text-gray-700">{testPlan.approach.strategy}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Methodology</h4>
        <p className="text-gray-700">{testPlan.approach.methodology}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Testing Phases</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testPlan.approach.phases.map((phase, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{phase}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Test Types</h4>
        <div className="flex flex-wrap gap-2">
          {testPlan.test_types.map((type, index) => (
            <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-4">
      {testPlan.schedule.phases.map((phase, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{phase.name}</h4>
            <span className="text-sm text-gray-600">{phase.start}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Duration: {phase.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Team Composition</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Team Size:</span>
            <span className="font-medium">{testPlan.resources.team_size} people</span>
          </div>
          <div className="space-y-1">
            {testPlan.resources.roles.map((role, index) => (
              <div key={index} className="text-sm text-gray-600 ml-2">• {role}</div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Duration:</span>
            <span className="font-medium">{testPlan.resources.duration}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Effort:</span>
            <span className="font-medium">{testPlan.resources.effort}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRisks = () => (
    <div className="space-y-3">
      {testPlan.risks.map((risk, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{risk.risk}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Impact: </span>
                  <span className={`font-medium ${
                    risk.impact === 'High' ? 'text-red-600' : 
                    risk.impact === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {risk.impact}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Probability: </span>
                  <span className={`font-medium ${
                    risk.probability === 'High' ? 'text-red-600' : 
                    risk.probability === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {risk.probability}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-600">Mitigation: </span>
                <span className="text-gray-700">{risk.mitigation}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(testPlan.tools).map(([category, tool]) => (
        <div key={category} className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 capitalize mb-1">
            {category.replace('_', ' ')}
          </h4>
          <p className="text-gray-700">{tool}</p>
        </div>
      ))}
    </div>
  );

  const renderDeliverables = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {testPlan.deliverables.map((deliverable, index) => (
        <div key={index} className="flex items-center space-x-2 p-2">
          <FileText className="w-4 h-4 text-primary-600" />
          <span className="text-gray-700">{deliverable}</span>
        </div>
      ))}
    </div>
  );

  const renderEditMode = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Edit mode will allow you to modify individual sections of the test plan.
          This feature will be implemented to allow inline editing of each section.
        </p>
      </div>
      
      {/* This would contain editable forms for each section */}
      <div className="text-center py-8">
        <Edit3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Edit Mode</h3>
        <p className="text-gray-600">Inline editing functionality coming soon</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Plan</h2>
          <p className="text-gray-600">Generated AI-powered test plan for your project</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF Format</span>
                  </button>
                  <button
                    onClick={() => handleExport('word')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Word (.docx)</span>
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Text (.txt)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onApprove}
            className="btn-primary flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve Plan</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'edit'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'preview' ? (
          <div className="space-y-4">
            {renderSection('Objective', renderObjective(), Target, 'objective')}
            {renderSection('Scope', renderScope(), FileText, 'scope')}
            {renderSection('Approach', renderApproach(), Settings, 'approach')}
            {renderSection('Schedule', renderSchedule(), Calendar, 'schedule')}
            {renderSection('Resources', renderResources(), Users, 'resources')}
            {renderSection('Risks', renderRisks(), AlertTriangle, 'risks')}
            {renderSection('Tools', renderTools(), Settings, 'tools')}
            {renderSection('Deliverables', renderDeliverables(), FileText, 'deliverables')}
          </div>
        ) : (
          renderEditMode()
        )}
      </div>
    </div>
  );
};

export default TestPlanViewer;