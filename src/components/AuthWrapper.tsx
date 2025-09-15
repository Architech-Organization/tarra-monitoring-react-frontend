import React, { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthWrapper: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle authentication events to prevent loops
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        if (event.payload) {
          console.log('Login successful:', event.payload);
          // Only navigate if we're not already on a protected route
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/') {
            navigate('/dashboard', { replace: true });
          }
        }
      }
      
      if (event.eventType === EventType.LOGIN_FAILURE) {
        console.error('Login failed:', event.payload);
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        console.log('Logout successful');
        navigate('/login', { replace: true });
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance, navigate]);

  // Prevent navigation loops on initial load
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await instance.handleRedirectPromise();
        if (result) {
          // Successfully handled redirect, don't navigate again
          return;
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
        // If there's an error and user is not authenticated, go to login
        if (!isAuthenticated && location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    };

    handleRedirectResult();
  }, [instance, navigate, isAuthenticated, location.pathname]);

  return null;
};