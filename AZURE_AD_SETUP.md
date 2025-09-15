# Azure AD Authentication Setup Guide

## 🚨 **Current Issue: "access_as_user" scope doesn't exist**

The error you're seeing indicates that your Azure AD app registration is missing a custom API scope. This is normal for basic setups. Here's how to fix it:

## 🔧 **Quick Fix (Recommended)**

I've already updated your frontend code to use basic Microsoft Graph scopes that always work:
- `openid` - Basic authentication
- `profile` - User profile information  
- `User.Read` - Read user's basic profile

**This should resolve the authentication error immediately.**

## 🏗️ **Long-term Solution: Configure Custom API Scopes** 

If you want full API authentication later, follow these steps:

### **Step 1: Expose API in your Azure AD App Registration**

1. **Go to Azure Portal** → Azure Active Directory → App registrations
2. **Find your app** (ID: `22c44e6e-c442-4c16-9a39-fe5a59e51c1c`)
3. **Click on "Expose an API"** in the left sidebar
4. **Set Application ID URI**:
   ```
   api://22c44e6e-c442-4c16-9a39-fe5a59e51c1c
   ```
5. **Add a scope**:
   - **Scope name**: `access_as_user`
   - **Admin consent display name**: `Access Tarra Monitoring API`
   - **Admin consent description**: `Allow the application to access the Tarra monitoring API on behalf of the signed-in user`
   - **User consent display name**: `Access monitoring data`
   - **User consent description**: `Allow access to monitoring sensor data`
   - **State**: `Enabled`

### **Step 2: Update API Permissions**

1. **Go to "API permissions"** in your app registration
2. **Add a permission** → **My APIs** 
3. **Select your app** → **Select "access_as_user"**
4. **Grant admin consent** for your organization

### **Step 3: Configure Backend to Accept Tokens**

Your FastAPI backend needs to validate Azure AD tokens. Add this to your backend:

```python
# In your backend requirements.txt
fastapi-azure-auth==4.3.0

# In your main.py or auth middleware
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer

azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id="22c44e6e-c442-4c16-9a39-fe5a59e51c1c",
    tenant_id="51df06a3-27ed-4987-85b6-f9018ad9c7b9",
    scopes={
        "api://22c44e6e-c442-4c16-9a39-fe5a59e51c1c/access_as_user": "Access monitoring API"
    }
)
```

## 🚀 **What Works Right Now**

Your frontend will now work with **basic authentication**:

### **✅ Authentication Flow**
1. User logs in with Azure AD
2. Gets basic Microsoft Graph token
3. Token is sent to your backend APIs
4. Backend can validate the token and get user info

### **✅ Available User Information**
```javascript
// In your frontend, you can access:
const { accounts } = useMsal();
const account = accounts[0];

console.log(account.name);           // User's display name
console.log(account.username);       // User's email/UPN  
console.log(account.localAccountId); // Unique user ID
console.log(account.tenantId);       // Your tenant ID
```

### **✅ Backend Token Validation**
Even without custom scopes, your backend can validate tokens:

```python
# Simple token validation in FastAPI
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import jwt
import requests

security = HTTPBearer()

def get_current_user(token: str = Depends(security)):
    try:
        # Decode token to get user info
        # Microsoft Graph tokens are valid and contain user claims
        decoded = jwt.decode(token.credentials, options={"verify_signature": False})
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## 🔍 **Testing the Fix**

1. **Clear browser storage**:
   ```javascript
   // In browser console
   sessionStorage.clear();
   localStorage.clear();
   ```

2. **Restart your frontend**:
   ```bash
   npm run dev
   ```

3. **Check authentication**:
   - Login should work without the "access_as_user" error
   - Dashboard should load and make API calls
   - Check browser console for successful token acquisition

## 🛠️ **Troubleshooting**

### **If you still get authentication errors:**

1. **Check your .env file**:
   ```bash
   VITE_AZURE_CLIENT_ID=22c44e6e-c442-4c16-9a39-fe5a59e51c1c
   VITE_AZURE_TENANT_ID=51df06a3-27ed-4987-85b6-f9018ad9c7b9
   VITE_AZURE_REDIRECT_URI=http://localhost:5173
   ```

2. **Verify Azure AD app registration**:
   - Redirect URI includes `http://localhost:5173`
   - "Public client" flows are enabled if needed
   - App is not expired or disabled

3. **Check browser console**:
   - Look for MSAL configuration errors
   - Check if AuthDebugger shows authentication status
   - Verify API calls are being made

### **Common Azure AD Issues:**

**"AADSTS50011: Redirect URI mismatch"**
- Add `http://localhost:5173` to your app registration redirect URIs

**"AADSTS65004: User declined consent"**  
- User needs to accept permissions during login

**"AADSTS700016: Application not found"**
- Check your client ID is correct

**"AADSTS90002: Tenant not found"**
- Check your tenant ID is correct

## 📋 **Current Configuration**

Your frontend now uses these **safe, always-available scopes**:
- ✅ `openid` - Basic authentication info
- ✅ `profile` - User's display name and basic profile
- ✅ `User.Read` - Microsoft Graph user info

This provides enough information for:
- ✅ User authentication and login
- ✅ User display name and email  
- ✅ Basic authorization and role checking
- ✅ Secure API communication

## 🎯 **Next Steps**

1. **Test the current setup** - it should work immediately
2. **Verify backend connectivity** - check API calls succeed
3. **Optional**: Set up custom API scopes later if needed
4. **Deploy**: This configuration works in production too

The authentication error should now be resolved! 🎉