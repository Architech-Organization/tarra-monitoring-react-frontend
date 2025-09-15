// TypeScript type definitions for the Tarra Monitoring System

export interface SensorData {
  id: string;
  timestamp: string;
  location: string;
  ppv_x?: number;
  ppv_y?: number;
  ppv_z?: number;
  ppv_resultant?: number;
  frequency_peak?: number;
  temperature?: number;
  battery_voltage?: number;
  status: 'online' | 'offline' | 'warning' | 'error';
}

export interface HoskinSensorData extends SensorData {
  instrument_id: string;
  channel_1_ppv?: number;
  channel_2_ppv?: number;
  channel_3_ppv?: number;
  channel_4_ppv?: number;
  peak_frequency_hz?: number;
  air_overpressure_db?: number;
  temperature_c?: number;
  signal_strength?: number;
  event_type: string;
  trigger_level_exceeded: string;
  waveform_duration_ms?: number;
  pretrigger_ms?: number;
  notes?: string;
}

export interface SixenseSensorData extends SensorData {
  sensor_id: string;
  acceleration_x?: number;
  acceleration_y?: number;
  acceleration_z?: number;
  displacement_x?: number;
  displacement_y?: number;
  displacement_z?: number;
  alarm_status: string;
  notes?: string;
}

export interface Alert {
  id: string;
  sensor_id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  threshold_exceeded?: string;
  value?: number;
  threshold?: number;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved: boolean;
  resolved_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  tenant_id: string;
  last_login?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard_layout?: DashboardLayout[];
}

export interface DashboardLayout {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'alert';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  sensor_id?: string;
  label?: string;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'critical';
  total_sensors: number;
  online_sensors: number;
  offline_sensors: number;
  active_alerts: number;
  last_updated: string;
}

export interface WebSocketMessage {
  type: 'sensor_data' | 'alert' | 'system_status' | 'user_action';
  payload: any;
  timestamp: string;
  sender?: string;
}

// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SensorConfigForm {
  name: string;
  location: string;
  sensor_type: 'hoskin_m80' | 'sixense_vibration';
  thresholds: {
    warning: number;
    critical: number;
  };
  sampling_rate?: number;
  calibration?: Record<string, number>;
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'area';
  title: string;
  data_source: string;
  time_range: '1h' | '6h' | '24h' | '7d' | '30d';
  refresh_interval: number;
  y_axis: {
    label: string;
    unit: string;
    min?: number;
    max?: number;
  };
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  color: string;
  sensor_ids: string[];
  data_field: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles?: string[];
  children?: NavItem[];
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primary_color: string;
  secondary_color: string;
  font_family: string;
  border_radius: number;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  [key: string]: any;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
}

// Environment Variables
export interface EnvironmentConfig {
  VITE_API_BASE_URL: string;
  VITE_AZURE_CLIENT_ID: string;
  VITE_AZURE_TENANT_ID: string;
  VITE_AZURE_REDIRECT_URI: string;
  VITE_WS_ENDPOINT: string;
  VITE_ENABLE_PWA: boolean;
  VITE_DEBUG_MODE: boolean;
}
