import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from '../common/Breadcrumb';

const Layout = ({ children, currentPhase, onPhaseChange, projectData }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPhase={currentPhase}
        onPhaseChange={onPhaseChange}
        projectData={projectData}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPhase={currentPhase}
          projectData={projectData}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Breadcrumb 
              currentPhase={currentPhase}
              projectData={projectData}
            />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;