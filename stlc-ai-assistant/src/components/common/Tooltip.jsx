import React, { useState } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 200,
  className = '',
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getTooltipClasses = () => {
    const baseClasses = 'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg pointer-events-none transition-opacity duration-200';
    
    const positionClasses = {
      top: '-top-8 left-1/2 transform -translate-x-1/2',
      bottom: '-bottom-8 left-1/2 transform -translate-x-1/2',
      left: 'top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full',
      right: 'top-1/2 -right-2 transform -translate-y-1/2 translate-x-full'
    };

    const arrowClasses = {
      top: 'before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900',
      bottom: 'before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900',
      left: 'before:absolute before:top-1/2 before:left-full before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-gray-900',
      right: 'before:absolute before:top-1/2 before:right-full before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900'
    };

    return `${baseClasses} ${positionClasses[position]} ${arrowClasses[position]} ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`;
  };

  if (!content || disabled) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div 
        className={getTooltipClasses()}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;