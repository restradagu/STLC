import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ currentPhase, projectData }) => {
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Dashboard', phase: 'dashboard', icon: Home }
    ];

    switch (currentPhase) {
      case 'requirements':
        items.push({ label: 'Requirements Analysis', phase: 'requirements' });
        break;
      case 'planning':
        items.push({ label: 'Requirements Analysis', phase: 'requirements' });
        items.push({ label: 'Test Planning', phase: 'planning' });
        break;
      case 'testcases':
        items.push({ label: 'Requirements Analysis', phase: 'requirements' });
        items.push({ label: 'Test Planning', phase: 'planning' });
        items.push({ label: 'Test Case Development', phase: 'testcases' });
        break;
      default:
        break;
    }

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;
        const isCompleted = projectData?.phases?.[item.phase]?.progress > 0;

        return (
          <React.Fragment key={item.phase}>
            <div className={`flex items-center space-x-1 ${
              isLast 
                ? 'text-gray-900 font-medium' 
                : isCompleted 
                ? 'text-primary-600 hover:text-primary-700 cursor-pointer' 
                : 'text-gray-500'
            }`}>
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </div>
            {!isLast && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;