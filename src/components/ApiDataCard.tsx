import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useAuthenticatedApi } from '../utils/api';

interface ApiDataCardProps {
  endpoint?: string;
  title?: string;
}

export const ApiDataCard: React.FC<ApiDataCardProps> = ({
  endpoint = '/api/v1/sensors/analytics?hours_back=24',
  title = 'API Data Explorer'
}) => {
  const { getApiClient } = useAuthenticatedApi();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching data from:', endpoint);

      // Get the authenticated client and capture token info
      const client = await getApiClient();

      // Extract token from headers if available
      const authHeader = client.defaults.headers.Authorization;
      if (authHeader && typeof authHeader === 'string') {
        const token = authHeader.replace('Bearer ', '');

        // Parse JWT token to get info (basic parsing, not validation)
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            setTokenInfo({
              tokenPreview: token.substring(0, 30) + '...',
              audience: payload.aud,
              issuer: payload.iss,
              scopes: payload.scp || payload.scope,
              expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'Unknown',
              issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'Unknown',
              subject: payload.sub,
              appId: payload.appid || payload.azp,
              roles: payload.roles,
              name: payload.name,
              email: payload.preferred_username || payload.upn,
            });
          }
        } catch (tokenError) {
          console.warn('Could not parse token:', tokenError);
        }
      }

      // Make the API call
      const response = await client.get(endpoint);

      console.log('✅ API Response received:', response.status);
      console.log('📦 Response data:', response.data);

      setData(response.data);

    } catch (err: any) {
      console.error('❌ API Error:', err);

      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          err.message ||
                          'Unknown error occurred';

      setError(`${err.response?.status || 'Network'} Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return (
    <Card sx={{ maxWidth: '100%', mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ApiIcon />
            {title}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchData}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Endpoint: <code>{endpoint}</code>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Token Information */}
        {tokenInfo && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon />
                Authentication Token Info
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <strong>Token Preview:</strong> <code>{tokenInfo.tokenPreview}</code>
                </Box>
                <Box>
                  <strong>Audience:</strong> <Chip label={tokenInfo.audience} size="small" />
                </Box>
                <Box>
                  <strong>Issuer:</strong> <code>{tokenInfo.issuer}</code>
                </Box>
                <Box>
                  <strong>Scopes:</strong> <code>{tokenInfo.scopes}</code>
                </Box>
                <Box>
                  <strong>App ID:</strong> <code>{tokenInfo.appId}</code>
                </Box>
                <Box>
                  <strong>User:</strong> {tokenInfo.name} ({tokenInfo.email})
                </Box>
                <Box>
                  <strong>Expires:</strong> {new Date(tokenInfo.expiresAt).toLocaleString()}
                </Box>
                {tokenInfo.roles && (
                  <Box>
                    <strong>Roles:</strong> {tokenInfo.roles.map((role: string) => (
                      <Chip key={role} label={role} size="small" sx={{ ml: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* API Response Data */}
        {data && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CodeIcon />
                API Response Data
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                maxHeight: 400,
                overflow: 'auto'
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {JSON.stringify(data, null, 2)}
                </pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Data Structure Analysis */}
        {data && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Data Structure Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2">Available Fields:</Typography>
                {Object.keys(data).map((key) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={key} size="small" variant="outlined" />
                    <Typography variant="body2" color="text.secondary">
                      {typeof data[key]}
                      {Array.isArray(data[key]) && ` (${data[key].length} items)`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          💡 This card shows the raw API response and token information for debugging purposes.
          Share this data to help create optimized dashboard components.
        </Typography>
      </CardContent>
    </Card>
  );
};