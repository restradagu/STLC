import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Phase1 from './components/Phase1/Phase1';
import Phase2 from './components/Phase2/Phase2';
import Phase3 from './components/Phase3/Phase3';
import Toast from './components/common/Toast';

const AppContent = () => {
  const { state, actions } = useApp();

  const renderCurrentPhase = () => {
    switch (state.currentPhase) {
      case 'dashboard':
        return <Dashboard />;
      case 'requirements':
        return <Phase1 />;
      case 'planning':
        return <Phase2 />;
      case 'testcases':
        return <Phase3 />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPhase={state.currentPhase}
      onPhaseChange={actions.setCurrentPhase}
      projectData={state}
    >
      {renderCurrentPhase()}
      <Toast />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
