import React, { useEffect, useRef } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useLocation } from 'react-router-dom';

interface AuthDebuggerProps {
  enabled?: boolean;
}

export const AuthDebugger: React.FC<AuthDebuggerProps> = ({ enabled = false }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress, accounts } = useMsal();
  const location = useLocation();
  
  const renderCount = useRef(0);
  const lastPath = useRef(location.pathname);
  
  useEffect(() => {
    renderCount.current++;
    
    if (enabled) {
      console.log('🔍 AuthDebugger Render #', renderCount.current, {
        isAuthenticated,
        inProgress,
        accountsCount: accounts?.length || 0,
        currentPath: location.pathname,
        pathChanged: lastPath.current !== location.pathname,
        timestamp: new Date().toISOString(),
      });
      
      // Detect potential loops
      if (renderCount.current > 10) {
        console.warn('⚠️ AuthDebugger: High render count detected - possible infinite loop!');
      }
      
      if (lastPath.current === location.pathname && renderCount.current > 5) {
        console.warn('⚠️ AuthDebugger: Same path rendered multiple times - possible navigation loop!');
      }
    }
    
    lastPath.current = location.pathname;
  }, [isAuthenticated, inProgress, location.pathname, accounts?.length, enabled]);
  
  // Reset render count when path changes significantly
  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      renderCount.current = 0;
    }
  }, [location.pathname]);
  
  if (!enabled || !import.meta.env.DEV) {
    return null;
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <div>🔍 Auth Debug</div>
      <div>Renders: {renderCount.current}</div>
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Progress: {inProgress}</div>
      <div>Path: {location.pathname}</div>
      <div>Accounts: {accounts?.length || 0}</div>
    </div>
  );
};