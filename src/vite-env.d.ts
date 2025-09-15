/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_TENANT_ID: string;
  readonly VITE_AZURE_REDIRECT_URI: string;
  readonly VITE_AZURE_SCOPES: string;
  readonly VITE_ENABLE_HTTPS: string;
  readonly VITE_SECURITY_HEADERS_ENABLED: string;
  readonly VITE_CSP_ENABLED: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_ENABLE_REAL_TIME_UPDATES: string;
  readonly VITE_CHART_UPDATE_INTERVAL: string;
  readonly VITE_DATA_REFRESH_INTERVAL: string;
  readonly VITE_MAX_DATA_POINTS: string;
  readonly VITE_ENABLE_SERVICE_WORKER: string;
  readonly VITE_CACHE_STRATEGY: string;
  readonly VITE_BUNDLE_ANALYZER: string;
  readonly VITE_MOCK_API: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_SHOW_DEBUG_PANELS: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_MAX_SENSORS: string;
  readonly VITE_MAX_ALERTS: string;
  readonly VITE_DATA_RETENTION_DAYS: string;
  readonly VITE_WS_ENDPOINT: string;
  readonly VITE_WS_RECONNECT_ATTEMPTS: string;
  readonly VITE_WS_RECONNECT_INTERVAL: string;
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string;
  readonly VITE_NOTIFICATION_TIMEOUT: string;
  readonly VITE_ENABLE_MAPS: string;
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_DEFAULT_LOCATION_LAT: string;
  readonly VITE_DEFAULT_LOCATION_LNG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window interface for global types
declare global {
  interface Window {
    __APP_VERSION__: string;
    __BUILD_DATE__: string;
  }
}

export {};