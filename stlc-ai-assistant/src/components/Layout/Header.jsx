import React, { useState } from 'react';
import { Bell, Settings, User, Download } from 'lucide-react';
import AzureConfigModal from '../common/AzureConfigModal';
import Tooltip from '../common/Tooltip';

const Header = ({ currentPhase, projectData }) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const getPhaseTitle = (phase) => {
    const titles = {
      dashboard: 'Project Dashboard',
      requirements: 'Requirement Analysis',
      planning: 'Test Planning',
      testcases: 'Test Case Development'
    };
    return titles[phase] || 'STLC AI Assistant';
  };

  const getPhaseDescription = (phase) => {
    const descriptions = {
      dashboard: 'Overview of your Software Testing Life Cycle project',
      requirements: 'Phase 1: Analyze and validate requirements with AI assistance',
      planning: 'Phase 2: Generate comprehensive test plans with AI intelligence',
      testcases: 'Phase 3: Develop and manage test cases with AI optimization'
    };
    return descriptions[phase] || '';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPhaseTitle(currentPhase)}
          </h1>
          <p className="text-gray-600 mt-1">
            {getPhaseDescription(currentPhase)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          {currentPhase !== 'dashboard' && (
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Phase {currentPhase === 'requirements' ? '1' : currentPhase === 'planning' ? '2' : '3'} Active
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Tooltip content="Notifications" position="bottom">
              <button className="p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
            <Tooltip content="Export project data" position="bottom">
              <button className="p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
            <Tooltip content="Azure OpenAI Configuration" position="bottom">
              <button 
                onClick={() => setIsConfigModalOpen(true)}
                className="p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
            <Tooltip content="User profile" position="bottom">
              <button className="p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <AzureConfigModal 
        isOpen={isConfigModalOpen} 
        onClose={() => setIsConfigModalOpen(false)} 
      />
    </header>
  );
};

export default Header;