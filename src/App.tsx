import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Box } from '@mui/material';

import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthWrapper } from './components/AuthWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SensorManagement = React.lazy(() => import('./pages/SensorManagement'));
const AlertsPage = React.lazy(() => import('./pages/AlertsPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));

export const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      {/* Global SEO and Security Headers */}
      <Helmet
        titleTemplate="%s | Tarra Monitoring System"
        defaultTitle="Tarra Monitoring System - Enterprise Vibration Monitoring"
      >
        <meta name="description" content="Enterprise-grade vibration monitoring system with real-time analytics, Azure AD security, and comprehensive sensor management." />
        <meta name="keywords" content="vibration monitoring, industrial sensors, real-time analytics, enterprise security, IoT monitoring" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Application Routes */}
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <React.Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Sensor Management */}
              <Route path="sensors" element={<SensorManagement />} />
              
              {/* Alerts */}
              <Route path="alerts" element={<AlertsPage />} />
              
              {/* Analytics */}
              <Route path="analytics" element={<AnalyticsPage />} />
              
              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Suspense>
      </Box>

      {/* Authentication Wrapper for handling auth state */}
      <AuthWrapper />
    </>
  );
};
