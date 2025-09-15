# Dashboard Implementation - Complete Guide

## 🎯 Summary

Your frontend dashboard is now fully implemented and connected to your backend API! The empty dashboard issue has been resolved with a comprehensive monitoring interface that displays:

- **Real-time sensor data** from both Hoskin M80 and Sixense sensors
- **Interactive charts** showing vibration trends and sensor health
- **Auto-refreshing data** with configurable intervals
- **Summary statistics** with sensor counts, alerts, and battery levels
- **Detailed sensor cards** with status, location, and recent readings
- **Recent events table** showing the latest sensor activities
- **Location-based summaries** with aggregated sensor data

## 🔧 What Was Implemented

### 1. **Secure API Integration**
- **`src/utils/api.ts`**: Authenticated API client with MSAL token integration
- **`src/hooks/useSensorData.ts`**: React Query hooks for efficient data fetching
- **`src/types/index.ts`**: Updated TypeScript types matching your backend models

### 2. **Dashboard Components**
- **`src/pages/Dashboard.tsx`**: Main dashboard with auto-refreshing data display
- **`src/components/charts/VibrationTrendChart.tsx`**: Time-series vibration data visualization
- **`src/components/charts/SensorOverviewChart.tsx`**: Sensor health pie chart
- **`src/components/tables/LocationSummaryTable.tsx`**: Location-based sensor summaries
- **`src/components/tables/RecentEventsTable.tsx`**: Recent sensor events and alerts

### 3. **Key Features**
- ✅ **Authentication Integration**: Secure API calls using your Azure AD tokens
- ✅ **Auto-refresh**: Configurable data refresh intervals (1 minute for summary, 5 minutes for analytics)
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Error Handling**: Graceful error handling and retry logic  
- ✅ **Loading States**: Professional loading indicators and skeleton screens
- ✅ **Data Caching**: Optimized API calls with React Query caching
- ✅ **Security**: OWASP-compliant security headers and input validation

## 🚀 Backend API Endpoints Used

Your dashboard connects to these backend endpoints:
- `GET /api/v1/sensors/summary` - Sensor status overview
- `GET /api/v1/sensors/locations` - Available sensor locations  
- `GET /api/v1/sensors/hoskin-m80/data` - Hoskin M80 sensor readings
- `GET /api/v1/sensors/sixense/data` - Sixense sensor readings
- `GET /api/v1/sensors/analytics` - Dashboard analytics data

## 📊 Data Sources

The dashboard displays data from your CSV files:
- **Hoskin M80**: Channel PPV values, frequency, temperature, battery, signal strength
- **Sixense**: 3-axis PPV/acceleration/displacement, frequency, temperature, battery

## 🔧 Setup Instructions

### 1. **Environment Configuration**
```bash
# Copy the environment template
cp .env.example .env

# Edit with your actual values
VITE_AZURE_CLIENT_ID=your-azure-client-id
VITE_AZURE_TENANT_ID=your-azure-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8000
```

### 2. **Install Dependencies** 
```bash
npm install
```

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Verify Backend Connection**
- Make sure your Python backend is running on port 8000
- Check that your Azure AD configuration allows the frontend domain
- Verify CORS settings in your backend allow requests from localhost:5173

## 🎨 Dashboard Features

### **Main Dashboard View**
- **Summary Cards**: Total sensors, online sensors, active alerts, average battery level
- **Auto-refresh Indicator**: Shows data refresh status and intervals
- **Manual Refresh**: Manual refresh button for immediate data updates

### **Sensor Status Grid**
Each sensor card shows:
- Sensor ID and location
- Current status (Normal/Warning/Critical)
- Battery level and temperature  
- Last reading timestamp
- Click to view detailed information

### **Charts and Analytics**
- **Vibration Trends**: Time-series chart showing PPV values across locations
- **Sensor Health**: Pie chart showing distribution of sensor statuses
- **Location Summary**: Table with sensor counts, PPV statistics, and alert counts
- **Recent Events**: Table showing latest sensor activities and alerts

### **Data Refresh Strategy**
- **Sensor Summary**: Auto-refreshes every 1 minute
- **Analytics Data**: Auto-refreshes every 5 minutes
- **Location Data**: Cached for 5 minutes
- **Manual Refresh**: Immediately fetches fresh data from all endpoints

## 🛠️ Troubleshooting

### **If Dashboard Shows "Loading" Forever:**

1. **Check Network Tab** in browser developer tools:
   ```bash
   # Look for failed API requests
   # Common issues: 401 (auth), 403 (permissions), 500 (server error)
   ```

2. **Verify Environment Variables**:
   ```bash
   # Check that .env file has correct values
   cat .env
   ```

3. **Check Backend Logs**:
   ```bash
   # Look for CORS errors, authentication failures, or database issues
   tail -f tarra_api.log
   ```

4. **Authentication Debug**:
   - Open browser developer tools
   - Look for the AuthDebugger component in top-right corner
   - Check console for MSAL authentication errors

### **Common Issues:**

**401 Unauthorized**: 
- Check Azure AD configuration
- Verify client ID and tenant ID in `.env`
- Check token expiration

**CORS Errors**:
- Verify backend CORS settings allow your frontend domain
- Check `allowed_origins` in backend configuration

**No Data Displayed**:
- Check if backend has sensor data in database
- Verify API endpoints return expected data format
- Check browser console for JavaScript errors

**Slow Performance**:
- Check network requests for large payloads
- Verify refresh intervals are appropriate
- Monitor React Query cache performance

## 🔍 Monitoring and Debugging

### **Browser Debug Tools**
- **AuthDebugger**: Shows authentication status and render counts (development only)
- **React Query DevTools**: Inspect API call cache and status  
- **Console Logging**: Detailed logging for API calls and data fetching

### **Performance Monitoring**
- Data caching with React Query reduces API calls
- Optimistic updates for better user experience
- Lazy loading for chart components
- Efficient re-renders with React.memo and useMemo

## 📈 Next Steps

### **Enhancements to Consider:**
1. **Historical Data Views**: Add date range pickers for historical analysis
2. **Alert Management**: Add alert acknowledgment and management features
3. **Export Functionality**: Allow data export to CSV/PDF formats
4. **Mobile App**: Create React Native mobile version
5. **Advanced Analytics**: Add trend analysis and predictive insights
6. **User Preferences**: Save dashboard layouts and preferences
7. **Push Notifications**: Browser notifications for critical events

### **Performance Optimizations:**
1. **Data Virtualization**: For large sensor lists
2. **Chart Optimization**: Canvas-based charts for better performance
3. **Service Worker**: Offline functionality and background sync
4. **CDN Integration**: Static asset optimization

## 🔐 Security Features

- **Azure AD Integration**: Enterprise-grade authentication
- **Token-based API Access**: Secure API communication
- **CORS Protection**: Properly configured cross-origin requests
- **Input Validation**: Client-side and server-side validation
- **Security Headers**: CSP, HSTS, and other security headers
- **XSS Protection**: React's built-in XSS prevention
- **Error Handling**: Secure error messages without exposing internals

## 📚 Technical Architecture

### **Frontend Stack:**
- **React 18** with TypeScript for type safety
- **Material-UI (MUI)** for enterprise UI components
- **React Query** for server state management and caching  
- **Recharts** for responsive data visualization
- **Azure MSAL** for secure authentication
- **Axios** for HTTP client with interceptors
- **React Router** for navigation

### **State Management:**
- **Server State**: React Query for API data caching and synchronization
- **Client State**: React useState and useContext for local component state
- **Authentication State**: Azure MSAL React integration
- **Auto-refresh**: React Query's refetchInterval for automatic data updates

## ⚡ Data Refresh Strategy

The dashboard uses an intelligent refresh strategy:

### **Automatic Refresh**
- **High Priority Data** (sensor summary): 60 seconds
- **Medium Priority Data** (analytics): 5 minutes  
- **Low Priority Data** (locations): 5 minutes (cached)

### **Manual Refresh**
- **Immediate**: Manual refresh button fetches all data immediately
- **Smart Caching**: React Query prevents unnecessary duplicate requests
- **Error Recovery**: Failed requests are automatically retried with exponential backoff

### **Performance Benefits**
- Reduces server load with intelligent caching
- Provides fresh data without overwhelming the backend
- Maintains good user experience with loading states
- Efficient bandwidth usage with cached responses

Your dashboard is now fully operational and ready for production deployment! 🚀