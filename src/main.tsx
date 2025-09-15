import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { App } from './App';
import { msalConfig, isRedirectCallback } from './config/authConfig';
import { theme } from './config/theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ServiceWorkerRegistration } from './utils/serviceWorker';

import './styles/globals.css';

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

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Add event callback to prevent loops
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    console.log('Login successful, account:', event.payload);
  }
});

const initializeApp = async () => {
  try {
    // Initialize MSAL
    await msalInstance.initialize();
    
    // Handle redirect promise only if we're in a redirect callback
    if (isRedirectCallback()) {
      try {
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          console.log('Redirect handled successfully:', response.account?.username);
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    }

    // Remove loading screen
    const loadingElement = document.querySelector('.loading-spinner');
    if (loadingElement) {
      loadingElement.remove();
    }

    // Add React root indicator
    document.getElementById('root')?.setAttribute('data-react-root', 'true');

    // Render the app
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

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
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Show error message to user
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: 'Roboto', sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h2 style="color: #f44336; margin-bottom: 16px;">Application Failed to Load</h2>
            <p style="color: #666; margin-bottom: 24px;">
              There was an error initializing the authentication system.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="
                background: #1976d2;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              "
            >
              Retry
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Start the app
initializeApp();