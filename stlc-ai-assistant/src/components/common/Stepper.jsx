import React from 'react';
import { Check } from 'lucide-react';

const Stepper = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  allowNonLinear = false,
  orientation = 'horizontal',
  className = ''
}) => {
  const getStepStatus = (stepId, index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = index;

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const isClickable = (stepId, index) => {
    if (!onStepClick) return false;
    if (allowNonLinear) return true;
    
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    return index <= currentIndex;
  };

  const renderHorizontalStepper = () => (
    <nav aria-label="Progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const clickable = isClickable(step.id, index);
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex items-center">
              <div
                className={`flex items-center ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => clickable && onStepClick(step.id)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onStepClick(step.id);
                  }
                }}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    status === 'completed'
                      ? 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                      : status === 'current'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  } ${clickable && status !== 'current' ? 'hover:border-primary-400' : ''}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <p
                    className={`text-sm font-medium transition-colors duration-200 ${
                      status === 'current'
                        ? 'text-primary-600'
                        : status === 'completed'
                        ? 'text-primary-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ml-6 transition-colors duration-200 ${
                    getStepStatus(steps[index + 1].id, index + 1) === 'upcoming'
                      ? 'bg-gray-300'
                      : 'bg-primary-600'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const renderVerticalStepper = () => (
    <nav aria-label="Progress" className={`${className}`}>
      <ol className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const clickable = isClickable(step.id, index);
          const Icon = step.icon;

          return (
            <li key={step.id} className="relative">
              <div
                className={`flex items-start ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => clickable && onStepClick(step.id)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onStepClick(step.id);
                  }
                }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    status === 'completed'
                      ? 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                      : status === 'current'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  } ${clickable && status !== 'current' ? 'hover:border-primary-400' : ''}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium transition-colors duration-200 ${
                      status === 'current'
                        ? 'text-primary-600'
                        : status === 'completed'
                        ? 'text-primary-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-6 transition-colors duration-200 ${
                    getStepStatus(steps[index + 1].id, index + 1) === 'upcoming'
                      ? 'bg-gray-300'
                      : 'bg-primary-600'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return orientation === 'horizontal' ? renderHorizontalStepper() : renderVerticalStepper();
};

export default Stepper;