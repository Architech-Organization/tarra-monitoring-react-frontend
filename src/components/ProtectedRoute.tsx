import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const location = useLocation();

  // Show loading while authentication is in progress
  if (inProgress !== 'none') {
    return <LoadingScreen message="Authenticating..." />;
  }

  // If not authenticated, redirect to login but preserve the attempted URL
  if (!isAuthenticated) {
    // Prevent loop by checking if we're already trying to go to login
    if (location.pathname === '/login') {
      return <LoadingScreen message="Redirecting to login..." />;
    }
    
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};