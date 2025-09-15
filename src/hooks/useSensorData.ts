import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi, apiUtils } from '../utils/api';
import {
  SensorDataSummary,
  HoskinM80Data,
  SixenseData,
  SensorDataQuery,
  PaginatedResponse,
  AnalyticsData,
  ApiResponse,
} from '../types';

// Query keys for React Query cache management
export const sensorQueryKeys = {
  all: ['sensors'] as const,
  summary: () => [...sensorQueryKeys.all, 'summary'] as const,
  locations: () => [...sensorQueryKeys.all, 'locations'] as const,
  ids: (sensorType?: string) => [...sensorQueryKeys.all, 'ids', sensorType] as const,
  hoskinData: (query: SensorDataQuery) => [...sensorQueryKeys.all, 'hoskin-m80', query] as const,
  sixenseData: (query: SensorDataQuery) => [...sensorQueryKeys.all, 'sixense', query] as const,
  analytics: (hoursBack: number) => [...sensorQueryKeys.all, 'analytics', hoursBack] as const,
};

// Hook to get sensor summary
export const useSensorSummary = () => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.summary(),
    queryFn: async (): Promise<SensorDataSummary[]> => {
      const client = await getApiClient();
      const response = await client.get('/api/v1/sensors/summary');
      return apiUtils.validateResponse<SensorDataSummary[]>(response);
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to get sensor locations
export const useSensorLocations = () => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.locations(),
    queryFn: async (): Promise<string[]> => {
      const client = await getApiClient();
      const response = await client.get('/api/v1/sensors/locations');
      return apiUtils.validateResponse<string[]>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get sensor IDs
export const useSensorIds = (sensorType?: string) => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.ids(sensorType),
    queryFn: async (): Promise<string[]> => {
      const client = await getApiClient();
      const queryString = sensorType ? `?sensor_type=${sensorType}` : '';
      const response = await client.get(`/api/v1/sensors/ids${queryString}`);
      return apiUtils.validateResponse<string[]>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get Hoskin M80 data
export const useHoskinM80Data = (query: SensorDataQuery) => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.hoskinData(query),
    queryFn: async (): Promise<PaginatedResponse<HoskinM80Data>> => {
      const client = await getApiClient();
      const queryString = apiUtils.createQueryString(query);
      const response = await client.get(`/api/v1/sensors/hoskin-m80/data?${queryString}`);
      return apiUtils.validateResponse<PaginatedResponse<HoskinM80Data>>(response);
    },
    enabled: Object.keys(query).length > 0, // Only run if query has parameters
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};

// Hook to get Sixense data
export const useSixenseData = (query: SensorDataQuery) => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.sixenseData(query),
    queryFn: async (): Promise<PaginatedResponse<SixenseData>> => {
      const client = await getApiClient();
      const queryString = apiUtils.createQueryString(query);
      const response = await client.get(`/api/v1/sensors/sixense/data?${queryString}`);
      return apiUtils.validateResponse<PaginatedResponse<SixenseData>>(response);
    },
    enabled: Object.keys(query).length > 0, // Only run if query has parameters
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};

// Hook to get analytics data
export const useAnalyticsData = (hoursBack: number = 24) => {
  const { getApiClient } = useAuthenticatedApi();

  return useQuery({
    queryKey: sensorQueryKeys.analytics(hoursBack),
    queryFn: async (): Promise<AnalyticsData> => {
      const client = await getApiClient();
      const response = await client.get(`/api/v1/sensors/analytics?hours_back=${hoursBack}`);
      return apiUtils.validateResponse<AnalyticsData>(response);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    retry: 2,
  });
};

// Hook to start live stream
export const useStartLiveStream = () => {
  const { getApiClient } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<ApiResponse> => {
      const client = await getApiClient();
      const response = await client.post('/api/v1/sensors/live-stream/start');
      return apiUtils.validateResponse<ApiResponse>(response);
    },
    onSuccess: () => {
      // Invalidate sensor data queries to refresh with live data
      queryClient.invalidateQueries({ queryKey: sensorQueryKeys.all });
    },
    onError: (error: any) => {
      console.error('Failed to start live stream:', apiUtils.handleApiError(error));
    },
  });
};

// Hook to stop live stream
export const useStopLiveStream = () => {
  const { getApiClient } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<ApiResponse> => {
      const client = await getApiClient();
      const response = await client.post('/api/v1/sensors/live-stream/stop');
      return apiUtils.validateResponse<ApiResponse>(response);
    },
    onSuccess: () => {
      // Invalidate sensor data queries
      queryClient.invalidateQueries({ queryKey: sensorQueryKeys.all });
    },
    onError: (error: any) => {
      console.error('Failed to stop live stream:', apiUtils.handleApiError(error));
    },
  });
};

// Combined hook for dashboard data (gets multiple data sources)
export const useDashboardData = () => {
  const summaryQuery = useSensorSummary();
  const analyticsQuery = useAnalyticsData(24);
  const locationsQuery = useSensorLocations();

  return {
    summary: summaryQuery,
    analytics: analyticsQuery,
    locations: locationsQuery,
    isLoading: summaryQuery.isLoading || analyticsQuery.isLoading || locationsQuery.isLoading,
    isError: summaryQuery.isError || analyticsQuery.isError || locationsQuery.isError,
    error: summaryQuery.error || analyticsQuery.error || locationsQuery.error,
    refetch: () => {
      summaryQuery.refetch();
      analyticsQuery.refetch();
      locationsQuery.refetch();
    },
  };
};

// WebSocket hook for real-time data
export const useWebSocketData = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastMessage, setLastMessage] = React.useState<any>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const wsUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8000'}/ws`;
    const ws = new WebSocket(wsUrl);

    setConnectionStatus('connecting');

    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        
        // Invalidate relevant queries when new data arrives
        if (data.type === 'sensor_data') {
          queryClient.invalidateQueries({ queryKey: sensorQueryKeys.summary() });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      setConnectionStatus('disconnected');
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [enabled, queryClient]);

  return {
    connectionStatus,
    lastMessage,
    isConnected: connectionStatus === 'connected',
  };
};