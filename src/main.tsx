import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { App } from './App';
import { msalConfig } from './config/authConfig';
import { theme } from './config/theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ServiceWorkerRegistration } from './utils/serviceWorker';

import './styles/globals.css';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize React Query client with security-focused settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Initialize MSAL
msalInstance
  .initialize()
  .then(() => {
    // Handle redirect promise
    return msalInstance.handleRedirectPromise();
  })
  .then(response => {
    if (response) {
      console.log('Successfully handled redirect:', response.account?.username);
    }
  })
  .catch(error => {
    console.error('MSAL initialization failed:', error);
  });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Remove loading screen
const loadingElement = document.querySelector('.loading-spinner');
if (loadingElement) {
  loadingElement.remove();
}

// Add React root indicator
document.getElementById('root')?.setAttribute('data-react-root', 'true');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <MsalProvider instance={msalInstance}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </MsalProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  ServiceWorkerRegistration.register();
}

// Enable hot module replacement in development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept();
}
