import React, { createContext, useContext, useState, ReactNode } from 'react';
import styled from 'styled-components';

// Types
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: ${({ theme }) => theme.zIndices.toast};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div<{ type: ToastType }>`
  min-width: 250px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: slideIn 0.3s ease-in-out;
  
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  }};
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} type={toast.type}>
            <span>{toast.message}</span>
            <CloseButton onClick={() => hideToast(toast.id)}>×</CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Hook for using the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
