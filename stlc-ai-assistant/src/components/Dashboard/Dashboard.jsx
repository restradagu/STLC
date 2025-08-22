import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TestTube, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  ArrowRight,
  Download,
  Play,
  Settings,
  BookOpen,
  Lock
} from 'lucide-react';

const Dashboard = () => {
  const { state, actions } = useApp();
  
  const getOverallProgress = () => {
    const phases = ['requirements', 'planning', 'testcases'];
    const totalProgress = phases.reduce((sum, phase) => {
      return sum + state.phases[phase].progress;
    }, 0);
    return Math.round(totalProgress / phases.length);
  };

  const getCompletedPhases = () => {
    return Object.values(state.phases).filter(phase => phase.progress === 100).length;
  };

  const getTotalRequirements = () => {
    return state.phases.requirements.data.requirements?.length || 0;
  };

  const getTotalTestCases = () => {
    return state.phases.testcases.data.testCases?.length || 0;
  };

  const getHighRiskItems = () => {
    const requirements = state.phases.requirements.data.requirements || [];
    return requirements.filter(req => req.risk_level === 'high' || req.risk_level === 'critical').length;
  };

  const getQualityScore = () => {
    return state.phases.requirements.data.qualityScore || 0;
  };

  const renderPhaseCard = (phaseKey, title, description, icon, color, comingSoon = false) => {
    const Icon = icon;
    const phase = state.phases[phaseKey];
    const isCompleted = phase?.progress === 100;
    const isStarted = phase?.progress > 0;
    
    return (
      <div className={`card transition-all duration-200 border-l-4 relative ${
        comingSoon 
          ? 'border-orange-300 bg-orange-50 opacity-75 cursor-not-allowed' 
          : isCompleted 
          ? 'border-green-500 bg-green-50 cursor-pointer hover:shadow-md' 
          : isStarted 
          ? `border-${color}-500 bg-${color}-50 cursor-pointer hover:shadow-md` 
          : 'border-gray-300 cursor-pointer hover:shadow-md'
      }`}
      onClick={() => !comingSoon && actions.setCurrentPhase(phaseKey)}
      title={comingSoon ? 'Próximamente - En desarrollo' : ''}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg relative ${
              comingSoon 
                ? 'bg-orange-100' 
                : isCompleted 
                ? 'bg-green-100' 
                : isStarted 
                ? `bg-${color}-100` 
                : 'bg-gray-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                comingSoon 
                  ? 'text-orange-600' 
                  : isCompleted 
                  ? 'text-green-600' 
                  : isStarted 
                  ? `text-${color}-600` 
                  : 'text-gray-400'
              }`} />
              {comingSoon && (
                <Lock className="w-3 h-3 absolute -top-1 -right-1 text-orange-500 bg-white rounded-full" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`font-medium ${comingSoon ? 'text-gray-700' : 'text-gray-900'}`}>
                  {title}
                </h3>
                {comingSoon && (
                  <span className="px-2 py-0.5 text-xs bg-orange-200 text-orange-800 rounded-full">
                    Próximamente
                  </span>
                )}
              </div>
              <p className={`text-sm ${comingSoon ? 'text-gray-500' : 'text-gray-600'}`}>
                {description}
              </p>
            </div>
          </div>
          
          {!comingSoon && isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
          {comingSoon && <Clock className="w-6 h-6 text-orange-500" />}
        </div>
        
        {!comingSoon && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{phase.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isStarted 
                    ? `bg-${color}-500` 
                    : 'bg-gray-300'
                }`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        )}
        
        {comingSoon && (
          <div className="space-y-2">
            <div className="text-sm text-orange-700 font-medium">En desarrollo</div>
            <div className="text-xs text-orange-600">
              Agentes IA para ejecución automática y generación de código
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-sm font-medium ${
            comingSoon 
              ? 'text-orange-600' 
              : isCompleted 
              ? 'text-green-600' 
              : isStarted 
              ? `text-${color}-600` 
              : 'text-gray-500'
          }`}>
            {comingSoon 
              ? 'Coming Soon' 
              : isCompleted 
              ? 'Completed' 
              : isStarted 
              ? 'In Progress' 
              : 'Not Started'}
          </span>
          {!comingSoon && <ArrowRight className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
    );
  };

  const renderMetricCard = (title, value, subtitle, icon, color, trend) => {
    const Icon = icon;
    
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`w-8 h-8 text-${color}-600`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{trend}</span>
          </div>
        )}
      </div>
    );
  };

  const renderQuickActions = () => (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={() => actions.setCurrentPhase('requirements')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Analyze Requirements</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
        
        <button 
          onClick={() => actions.setCurrentPhase('planning')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Generate Test Plan</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
        
        <button 
          onClick={() => actions.setCurrentPhase('testcases')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <TestTube className="w-5 h-5 text-green-600" />
            <span className="font-medium">Create Test Cases</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
        
        <button 
          onClick={() => actions.saveToFile()}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-orange-600" />
            <span className="font-medium">Export Project</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {state.notifications.slice(0, 5).map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {state.notifications.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );

  const renderProjectInfo = () => (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Project Name</label>
          <p className="text-gray-900">{state.project.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Description</label>
          <p className="text-gray-900">{state.project.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-gray-900 text-sm">
              {new Date(state.project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Modified</label>
            <p className="text-gray-900 text-sm">
              {new Date(state.project.lastModified).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your STLC progress and manage testing activities with AI assistance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
            <Zap className="w-5 h-5 text-primary-600" />
            <span className="text-primary-700 font-medium">AI Powered</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">{getOverallProgress()}% Complete</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Overall Progress', 
          `${getOverallProgress()}%`, 
          `${getCompletedPhases()}/3 phases completed`,
          BarChart3, 
          'primary'
        )}
        {renderMetricCard(
          'Requirements', 
          getTotalRequirements(), 
          'Total analyzed',
          FileText, 
          'blue'
        )}
        {renderMetricCard(
          'Test Cases', 
          getTotalTestCases(), 
          'Generated by AI',
          TestTube, 
          'green'
        )}
        {renderMetricCard(
          'Quality Score', 
          `${getQualityScore()}%`, 
          'Requirements quality',
          Award, 
          'purple'
        )}
      </div>

      {/* Phase Overview */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">STLC Phases</h2>
        
        {/* Current Phases (1-3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {renderPhaseCard(
            'requirements',
            'Phase 1: Requirements Analysis',
            'Upload and analyze requirements with AI',
            FileText,
            'blue'
          )}
          {renderPhaseCard(
            'planning',
            'Phase 2: Test Planning',
            'Generate comprehensive test plans',
            Target,
            'purple'
          )}
          {renderPhaseCard(
            'testcases',
            'Phase 3: Test Case Development',
            'Create and manage test cases',
            TestTube,
            'green'
          )}
        </div>

        {/* Future Phases (4-6) */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Próximas Fases - En Desarrollo
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderPhaseCard(
            'environment',
            'Phase 4: Environment Setup',
            'AI-powered test environment configuration',
            Settings,
            'orange',
            true
          )}
          {renderPhaseCard(
            'execution',
            'Phase 5: Test Execution',
            'Automated execution with AI agents',
            Play,
            'orange',
            true
          )}
          {renderPhaseCard(
            'closure',
            'Phase 6: Test Closure',
            'Intelligent reporting and analysis',
            BookOpen,
            'orange',
            true
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info */}
        <div className="lg:col-span-1">
          {renderProjectInfo()}
        </div>
        
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          {renderQuickActions()}
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          {renderRecentActivity()}
        </div>
      </div>

      {/* Risk Indicators */}
      {getHighRiskItems() > 0 && (
        <div className="card border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-900">Attention Required</h3>
              <p className="text-orange-800 text-sm">
                {getHighRiskItems()} high-risk requirements identified. Review Phase 1 for details.
              </p>
            </div>
            <button 
              onClick={() => actions.setCurrentPhase('requirements')}
              className="ml-auto btn-secondary text-sm"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="card border-blue-200 bg-blue-50">
        <div className="flex items-start space-x-3">
          <Zap className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-2">AI Insights & Recommendations</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• {getTotalRequirements()} requirements analyzed with {getQualityScore()}% quality score</li>
              <li>• AI generated {getTotalTestCases()} test cases across multiple test types</li>
              <li>• Estimated 75-90% reduction in planning time compared to manual processes</li>
              {getHighRiskItems() > 0 && (
                <li>• {getHighRiskItems()} high-risk items require additional attention and testing</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Future AI Capabilities */}
      <div className="card border-orange-200 bg-orange-50">
        <div className="flex items-start space-x-3">
          <Settings className="w-6 h-6 text-orange-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium text-orange-900 mb-2">🚀 Próximas Características IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-orange-800 mb-1">Fase 4: Environment Setup</h4>
                <ul className="text-orange-700 space-y-0.5">
                  <li>• Provisión automática de entornos</li>
                  <li>• Validación de configuración con IA</li>
                  <li>• Generación Infrastructure as Code</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-orange-800 mb-1">Fase 5: Test Execution</h4>
                <ul className="text-orange-700 space-y-0.5">
                  <li>• Agentes IA para ejecución automática</li>
                  <li>• Generación código Playwright/Selenium</li>
                  <li>• Análisis de resultados en tiempo real</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-orange-800 mb-1">Fase 6: Test Closure</h4>
                <ul className="text-orange-700 space-y-0.5">
                  <li>• Reportes automáticos ejecutivos</li>
                  <li>• Análisis de defectos con IA</li>
                  <li>• Recomendaciones de mejora</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
              <p className="text-orange-800 text-xs font-medium">
                💡 Objetivo: Agentes IA autónomos que ejecuten pruebas y generen código de automatización
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;