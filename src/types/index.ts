// Updated sensor data types matching your backend API exactly

// Base interfaces
export interface BaseTimestamp {
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Enums matching your backend exactly
export enum EventType {
  VIBRATION = 'vibration',
  BLAST = 'blast',
  CONSTRUCTION = 'construction',
  TRAFFIC = 'traffic',
  UNKNOWN = 'unknown',
}

export enum TriggerStatus {
  YES = 'Yes',
  NO = 'No',
}

export enum AlarmStatus {
  NORMAL = 'Normal',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
}

export enum Status {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  MAINTENANCE = 'Maintenance',
}

export enum SensorType {
  HOSKIN_M80 = 'hoskin_m80',
  SIXENSE = 'sixense',
}

// Hoskin M80 sensor data structure (matching your CSV and backend)
export interface HoskinM80Data extends BaseTimestamp {
  id: number;
  instrument_id: string;
  location: string;
  channel_1_ppv: number;
  channel_2_ppv: number;
  channel_3_ppv: number;
  channel_4_ppv: number;
  peak_frequency_hz: number;
  air_overpressure_db: number;
  battery_v: number;
  temperature_c: number;
  signal_strength: number;
  event_type: EventType;
  trigger_level_exceeded: TriggerStatus;
  waveform_duration_ms: number;
  pretrigger_ms: number;
  notes?: string;
  created_at: string;
}

// Sixense sensor data structure (matching your CSV and backend)
export interface SixenseData extends BaseTimestamp {
  id: number;
  sensor_id: string;
  location: string;
  ppv_x: number;
  ppv_y: number;
  ppv_z: number;
  ppv_resultant: number;
  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;
  displacement_x: number;
  displacement_y: number;
  displacement_z: number;
  frequency_peak: number;
  temperature: number;
  battery_voltage: number;
  status: Status;
  alarm_status: AlarmStatus;
  notes?: string;
  created_at: string;
}

// API query parameters matching backend
export interface SensorDataQuery {
  sensor_id?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  event_type?: EventType;
  alarm_status?: AlarmStatus;
  limit?: number;
  offset?: number;
}

// Dashboard summary data matching backend
export interface SensorDataSummary {
  sensor_id: string;
  sensor_type: string; // "hoskin_m80" or "sixense"
  location: string;
  last_reading: string;
  status: string;
  alarm_status: string;
  battery_level: number;
  temperature: number;
}

// Analytics data structure
export interface AnalyticsData {
  overview: {
    total_sensors: number;
    active_sensors: number;
    total_readings_24h: number;
    alerts_24h: number;
  };
  sensor_health: SensorHealthData[];
  vibration_trends: VibrationTrendData[];
  location_summary: LocationSummaryData[];
  recent_events: RecentEventData[];
}

export interface SensorHealthData {
  sensor_id: string;
  location: string;
  status: 'healthy' | 'warning' | 'critical';
  battery_level: number;
  last_seen: string;
  uptime_percentage: number;
}

export interface VibrationTrendData {
  timestamp: string;
  location: string;
  ppv_max: number;
  frequency: number;
  event_type: EventType;
}

export interface LocationSummaryData {
  location: string;
  sensor_count: number;
  avg_ppv: number;
  max_ppv: number;
  alert_count: number;
  status: AlarmStatus;
}

export interface RecentEventData {
  timestamp: string;
  sensor_id: string;
  location: string;
  event_type: EventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ppv_value: number;
  frequency: number;
  description: string;
}

// Chart data interfaces
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  sensor_id?: string;
  location?: string;
}

// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

// Existing types from your current system (keeping compatibility)
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

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type SortDirection = 'asc' | 'desc';
export type SensorDataUnion = HoskinM80Data | SixenseData;

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