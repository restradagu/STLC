import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Clipboard, 
  TestTube, 
  CheckCircle,
  Circle,
  ChevronRight,
  Settings,
  Play,
  BookOpen,
  Lock,
  Clock
} from 'lucide-react';

const Sidebar = ({ currentPhase, onPhaseChange, projectData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const phases = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      description: 'Project Overview'
    },
    {
      id: 'requirements',
      title: 'Requirement Analysis',
      icon: FileText,
      description: 'Phase 1: Requirements & Validation',
      progress: projectData?.phases?.requirements?.progress || 0
    },
    {
      id: 'planning',
      title: 'Test Planning',
      icon: Clipboard,
      description: 'Phase 2: Test Strategy & Planning',
      progress: projectData?.phases?.planning?.progress || 0
    },
    {
      id: 'testcases',
      title: 'Test Case Development',
      icon: TestTube,
      description: 'Phase 3: Test Case Design & Development',
      progress: projectData?.phases?.testcases?.progress || 0
    },
    {
      id: 'environment',
      title: 'Environment Setup',
      icon: Settings,
      description: 'Phase 4: Test Environment Configuration',
      progress: 0,
      comingSoon: true,
      futureFeatures: ['Automated environment provisioning', 'AI-powered configuration validation', 'Infrastructure as Code generation']
    },
    {
      id: 'execution',
      title: 'Test Execution',
      icon: Play,
      description: 'Phase 5: AI-Powered Test Execution',
      progress: 0,
      comingSoon: true,
      futureFeatures: ['Automated test execution with AI agents', 'Real-time result analysis', 'Smart test automation code generation (Playwright, Selenium)']
    },
    {
      id: 'closure',
      title: 'Test Closure',
      icon: BookOpen,
      description: 'Phase 6: Results Analysis & Documentation',
      progress: 0,
      comingSoon: true,
      futureFeatures: ['Automated test reporting', 'AI-powered defect analysis', 'Executive summary generation']
    }
  ];

  const getProgressIcon = (progress) => {
    if (progress === 100) return CheckCircle;
    if (progress > 0) return Circle;
    return Circle;
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'text-primary-600';
    if (progress > 0) return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">STLC AI</h1>
              <p className="text-xs text-gray-600">Assistant</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {phases.map((phase) => {
          const IconComponent = phase.icon;
          const ProgressIcon = getProgressIcon(phase.progress);
          const isActive = currentPhase === phase.id;
          const isComingSoon = phase.comingSoon;

          return (
            <div key={phase.id} className="relative group">
              <div
                className={`sidebar-item ${isActive ? 'active' : ''} rounded-lg ${
                  isComingSoon 
                    ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                    : 'cursor-pointer'
                }`}
                onClick={() => !isComingSoon && onPhaseChange(phase.id)}
                title={isComingSoon ? 'Coming Soon - Future Implementation' : ''}
              >
                <div className="relative">
                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                    isComingSoon ? 'text-gray-400' : ''
                  }`} />
                  {isComingSoon && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-orange-500 bg-white rounded-full" />
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 ml-3">
                      <div className={`font-medium flex items-center ${
                        isComingSoon ? 'text-gray-500' : ''
                      }`}>
                        {phase.title}
                        {isComingSoon && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                            Próximamente
                          </span>
                        )}
                      </div>
                      {phase.description && (
                        <div className={`text-xs ${
                          isComingSoon ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {phase.description}
                        </div>
                      )}
                      {typeof phase.progress === 'number' && !isComingSoon && (
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${phase.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{phase.progress}%</span>
                        </div>
                      )}
                    </div>
                    
                    {!isComingSoon && typeof phase.progress === 'number' && (
                      <ProgressIcon className={`w-4 h-4 ${getProgressColor(phase.progress)}`} />
                    )}
                    {!isComingSoon && !phase.progress && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {isComingSoon && (
                      <Clock className="w-4 h-4 text-orange-500" />
                    )}
                  </>
                )}
              </div>

              {/* Tooltip for Coming Soon phases */}
              {isComingSoon && !isCollapsed && (
                <div className="absolute left-full ml-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 max-w-xs shadow-lg">
                    <div className="font-medium mb-2">🚀 Próximas Funcionalidades:</div>
                    <ul className="space-y-1">
                      {phase.futureFeatures?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-400 mr-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-gray-300 text-xs">
                      En desarrollo para versiones futuras
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {/* {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p className="font-medium">STLC AI Assistant</p>
            <p>Version 1.0.0 - Demo</p>
            <p className="mt-2 text-gray-400">
              Powered by Advanced AI for Software Testing Life Cycle
            </p>  
            <div className="mt-3 p-2 bg-orange-50 rounded-md border border-orange-100">
              <div className="flex items-center space-x-1 mb-1">
                <Clock className="w-3 h-3 text-orange-600" />
                <span className="font-medium text-orange-700 text-xs">Próximamente</span>
              </div>
              <p className="text-orange-600 text-xs">
                Fases 4-6 con agentes IA para ejecución automática y generación de código de pruebas
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Sidebar;