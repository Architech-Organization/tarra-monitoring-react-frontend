# Backend Connection Troubleshooting Guide

## 🚨 **Current Issue Analysis**

Based on your console logs, I can see:

✅ **Authentication is working perfectly!** 
- MSAL is successfully acquiring tokens
- No more "access_as_user" scope errors  
- Users can log in without issues

❌ **Backend API connection is failing**
- Network Error: Cannot connect to backend API
- CSP (Content Security Policy) blocking connections
- API endpoints returning "Network Error"

## 🔧 **Quick Fixes Applied**

### **1. Fixed Content Security Policy**
Updated `index.html` to allow connections to:
- `http://localhost:8000` (your backend)
- `http://127.0.0.1:8000` (alternative localhost)
- Azure AD endpoints for authentication

### **2. Fixed UI Warnings** 
- Fixed the disabled button tooltip warning
- Improved error handling with troubleshooting steps

## 🚀 **Next Steps to Connect Your Backend**

### **Step 1: Start Your Backend Server**
Make sure your Python FastAPI backend is running:

```bash
# Navigate to your backend directory
cd /path/to/tarra-monitoring-backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Step 2: Test Backend Directly**
Open a new browser tab and verify:
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health  
- **API Root**: http://localhost:8000/

You should see the FastAPI interactive documentation.

### **Step 3: Enable CORS in Backend**
Your backend needs to allow requests from your frontend. In your backend's `app/main.py`, ensure CORS is configured:

```python
# In your main.py CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Your frontend URL
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # Alternative frontend ports
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### **Step 4: Test API Endpoints**
Once your backend is running, test these endpoints directly in browser:
- http://localhost:8000/api/v1/sensors/summary
- http://localhost:8000/api/v1/sensors/locations
- http://localhost:8000/api/v1/sensors/analytics

### **Step 5: Restart Frontend** 
After backend is running:
```bash
# Clear browser cache
# Press Ctrl+Shift+R or Cmd+Shift+R

# Or restart frontend
npm run dev
```

## 🔍 **Debugging Steps**

### **If Backend Won't Start:**
1. **Check Python dependencies**:
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

2. **Check if port 8000 is available**:
   ```bash
   # Windows
   netstat -an | findstr :8000
   
   # Mac/Linux  
   lsof -i :8000
   ```

3. **Try alternative port**:
   ```bash
   uvicorn app.main:app --port 8001
   # Then update VITE_API_BASE_URL=http://localhost:8001
   ```

### **If API Calls Still Fail:**

1. **Check browser Network tab**:
   - Open Developer Tools (F12)
   - Go to Network tab
   - Try refreshing dashboard
   - Look for failed requests and their error details

2. **Test with curl**:
   ```bash
   curl http://localhost:8000/api/v1/sensors/summary
   ```

3. **Check backend logs**:
   - Look for CORS errors
   - Check for authentication middleware issues
   - Verify endpoints are registered correctly

### **If CORS Errors Persist:**
Add this to your backend for development:

```python
# Temporary CORS fix for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (dev only!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ **Expected Result**

Once your backend is running and CORS is configured:

1. **Dashboard should load** without "Network Error"
2. **API requests should succeed** (check Network tab)
3. **Data should display** in charts and tables
4. **No CSP violations** in console

## 📊 **Mock Data Option**

If you want to test the frontend immediately without backend, I can create mock data endpoints. This would let you see the dashboard working while you set up the backend.

## 🆘 **Still Having Issues?**

If you continue having problems:

1. **Share your backend startup logs** - any errors when starting the server?
2. **Test the backend health endpoint** - does http://localhost:8000/health work?  
3. **Check your backend CORS configuration** - is localhost:5173 allowed?
4. **Try disabling security temporarily** - comment out CSP to test

The authentication part is working perfectly now - we just need to connect the frontend to your backend API! 🎉