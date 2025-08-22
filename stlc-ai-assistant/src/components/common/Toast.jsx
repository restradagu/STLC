import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    state.notifications.forEach(notification => {
      if (!notification.autoRemoveTimer) {
        notification.autoRemoveTimer = setTimeout(() => {
          actions.removeNotification(notification.id);
        }, 5000);
      }
    });

    // Cleanup timers on unmount
    return () => {
      state.notifications.forEach(notification => {
        if (notification.autoRemoveTimer) {
          clearTimeout(notification.autoRemoveTimer);
        }
      });
    };
  }, [state.notifications, actions]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (state.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full shadow-lg rounded-lg border ${getBackgroundColor(notification.type)} transform transition-all duration-300 ease-in-out`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => actions.removeNotification(notification.id)}
                  className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;