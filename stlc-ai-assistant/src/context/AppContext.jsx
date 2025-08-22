import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  currentPhase: 'dashboard',
  project: {
    id: 'demo-project-001',
    name: 'E-Commerce Platform Testing',
    description: 'Comprehensive testing suite for a modern e-commerce platform',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },
  phases: {
    requirements: {
      progress: 0,
      completed: false,
      data: {
        requirements: [],
        functionalCount: 0,
        nonFunctionalCount: 0,
        qualityScore: 0,
        riskCount: 0,
        stakeholders: [],
        businessDrivers: [],
        uploadedFiles: []
      }
    },
    planning: {
      progress: 0,
      completed: false,
      data: {
        basicInfo: {},
        scope: {},
        resources: {},
        risks: {},
        generatedPlan: null,
        sections: {}
      }
    },
    testcases: {
      progress: 0,
      completed: false,
      data: {
        testCases: [],
        configuration: {
          includePositive: true,
          includeNegative: true,
          includeBoundary: true,
          testTypes: ['functional'],
          complexity: 'medium'
        },
        statistics: {
          total: 0,
          byPriority: { high: 0, medium: 0, low: 0 },
          byStatus: { draft: 0, review: 0, approved: 0 },
          byType: {}
        }
      }
    }
  },
  loading: false,
  notifications: [],
  errors: []
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PHASE':
      return {
        ...state,
        currentPhase: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'UPDATE_PHASE_DATA':
      const { phase, data } = action.payload;
      return {
        ...state,
        phases: {
          ...state.phases,
          [phase]: {
            ...state.phases[phase],
            data: {
              ...state.phases[phase].data,
              ...data
            },
            lastModified: new Date().toISOString()
          }
        },
        project: {
          ...state.project,
          lastModified: new Date().toISOString()
        }
      };

    case 'UPDATE_PHASE_PROGRESS':
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.payload.phase]: {
            ...state.phases[action.payload.phase],
            progress: action.payload.progress,
            completed: action.payload.progress === 100
          }
        }
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: action.payload.type || 'info',
            message: action.payload.message,
            timestamp: new Date().toISOString()
          }
        ]
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case 'ADD_ERROR':
      return {
        ...state,
        errors: [
          ...state.errors,
          {
            id: Date.now(),
            message: action.payload.message,
            timestamp: new Date().toISOString()
          }
        ]
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: []
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };

    case 'RESET_PROJECT':
      return {
        ...initialState,
        currentPhase: state.currentPhase
      };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        localStorage.setItem('stlc-ai-project', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(timer);
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stlc-ai-project');
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  const actions = {
    setCurrentPhase: (phase) => dispatch({ type: 'SET_CURRENT_PHASE', payload: phase }),
    
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    
    updatePhaseData: (phase, data) => dispatch({ 
      type: 'UPDATE_PHASE_DATA', 
      payload: { phase, data } 
    }),
    
    updatePhaseProgress: (phase, progress) => dispatch({ 
      type: 'UPDATE_PHASE_PROGRESS', 
      payload: { phase, progress } 
    }),
    
    addNotification: (type, message) => dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { type, message } 
    }),
    
    removeNotification: (id) => dispatch({ 
      type: 'REMOVE_NOTIFICATION', 
      payload: id 
    }),
    
    addError: (message) => dispatch({ 
      type: 'ADD_ERROR', 
      payload: { message } 
    }),
    
    clearErrors: () => dispatch({ type: 'CLEAR_ERRORS' }),
    
    resetProject: () => dispatch({ type: 'RESET_PROJECT' }),

    // Helper methods
    calculateProgress: (phase) => {
      const phaseData = state.phases[phase];
      if (!phaseData) return 0;

      switch (phase) {
        case 'requirements':
          return phaseData.data.requirements.length > 0 ? 100 : 0;
        case 'planning':
          return phaseData.data.generatedPlan ? 100 : 0;
        case 'testcases':
          return phaseData.data.testCases.length > 0 ? 100 : 0;
        default:
          return 0;
      }
    },

    saveToFile: () => {
      const dataStr = JSON.stringify(state, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stlc-project-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;