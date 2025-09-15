import { Configuration, LogLevel } from '@azure/msal-browser';

// Environment variables with fallbacks
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin;

if (!clientId || !tenantId) {
  throw new Error(
    'Azure AD configuration is missing. Please set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID in your environment variables.'
  );
}

// MSAL Configuration with security best practices and loop prevention
export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
    navigateToLoginRequestUrl: false, // Prevents navigation loops
    clientCapabilities: ['CP1'], // Support for Conditional Access
  },
  cache: {
    cacheLocation: 'sessionStorage', // More secure than localStorage
    storeAuthStateInCookie: false, // Set to true for IE11 support
    secureCookies: window.location.protocol === 'https:', // Secure cookies in production
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return; // Don't log PII data
        }
        switch (level) {
          case LogLevel.Error:
            console.error('MSAL Error:', message);
            return;
          case LogLevel.Warning:
            console.warn('MSAL Warning:', message);
            return;
          case LogLevel.Info:
            if (import.meta.env.DEV) {
              console.info('MSAL Info:', message);
            }
            return;
          default:
            return;
        }
      },
      piiLoggingEnabled: false, // Never log PII in production
      logLevel: import.meta.env.DEV ? LogLevel.Info : LogLevel.Warning,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false,
    allowRedirectInIframe: false, // Prevent iframe-related loops
  },
  telemetry: {
    application: {
      appName: 'Tarra Monitoring System',
      appVersion: '1.0.0',
    },
  },
};

// Login request configuration with loop prevention
export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
  prompt: 'select_account' as const,
  extraScopesToConsent: ['email'],
  redirectStartPage: window.location.href, // Preserve the original page
};

// Silent token request configuration
export const silentRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
  account: null as any, // Will be set dynamically
  forceRefresh: false,
};

// API access token request
export const apiTokenRequest = {
  scopes: [`api://${clientId}/access_as_user`],
  account: null as any, // Will be set dynamically
};

// Graph API request configuration
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/v1.0/me/messages',
};

// Protected resource map for automatic token acquisition
export const protectedResources = {
  apiTarra: {
    endpoint: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    scopes: [`api://${clientId}/access_as_user`],
  },
  graphMe: {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['User.Read'],
  },
};

// Utility function to validate authentication state
export const validateAuthState = (account: any): boolean => {
  if (!account) {
    return false;
  }
  
  // Check if account has required claims
  const requiredClaims = ['oid', 'tid', 'name'];
  return requiredClaims.every(claim => account.idTokenClaims?.[claim]);
};

// RBAC helper - define your application roles here
export const AppRoles = {
  ADMIN: 'Admin',
  OPERATOR: 'Operator', 
  VIEWER: 'Viewer',
} as const;

export type AppRole = typeof AppRoles[keyof typeof AppRoles];

// Check if user has required role
export const hasRole = (account: any, requiredRole: AppRole): boolean => {
  if (!account?.idTokenClaims?.roles) {
    return false;
  }
  
  const userRoles: string[] = account.idTokenClaims.roles;
  return userRoles.includes(requiredRole);
};

// Get user's highest role
export const getUserRole = (account: any): AppRole | null => {
  if (!account?.idTokenClaims?.roles) {
    return null;
  }
  
  const userRoles: string[] = account.idTokenClaims.roles;
  
  // Return highest priority role
  if (userRoles.includes(AppRoles.ADMIN)) return AppRoles.ADMIN;
  if (userRoles.includes(AppRoles.OPERATOR)) return AppRoles.OPERATOR;
  if (userRoles.includes(AppRoles.VIEWER)) return AppRoles.VIEWER;
  
  return null;
};

// Helper function to check if we're in a redirect callback
export const isRedirectCallback = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('code') || urlParams.has('error') || window.location.hash.includes('access_token');
};

// Helper function to get redirect target after login
export const getRedirectTarget = (defaultPath = '/dashboard'): string => {
  // Check if there's a saved redirect path
  const savedPath = sessionStorage.getItem('redirectPath');
  if (savedPath) {
    sessionStorage.removeItem('redirectPath');
    return savedPath;
  }
  
  // If we're coming from a specific page, redirect there
  if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
    return window.location.pathname;
  }
  
  return defaultPath;
};