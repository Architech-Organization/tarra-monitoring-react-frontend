import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();

  // Show loading while authentication is in progress
  if (inProgress !== 'none') {
    return <LoadingScreen message="Authenticating..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
