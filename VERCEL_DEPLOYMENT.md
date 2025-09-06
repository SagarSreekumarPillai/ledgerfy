# Vercel Deployment Guide for Ledgerfy

## 🚀 Quick Deploy (Hardcoded Mode)

For immediate deployment without database setup, use these **MINIMAL** environment variables:

### **REQUIRED (Minimum Setup)**
```
NODE_ENV=production
USE_MOCK_DATA=true
JWT_SECRET=your-super-secret-jwt-key-here-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this
NEXTAUTH_SECRET=your-nextauth-secret-here-change-this
NEXTAUTH_URL=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
API_URL=https://your-app-name.vercel.app/api
CORS_ORIGIN=https://your-app-name.vercel.app
```

### **Test Login Credentials (Hardcoded Mode)**
- **Admin**: `admin@ledgerfy.com` / `password123`
- **Manager**: `manager@ledgerfy.com` / `password123`  
- **Accountant**: `accountant@ledgerfy.com` / `password123`

---

## 🔧 Full Production Setup (Optional)

If you want to use a real database later, set up these services:

1. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for production database
2. **Upstash Redis**: Set up Redis instance for session storage and queues
3. **Email Service**: Configure email provider (Gmail, SendGrid, etc.)
4. **File Storage**: Set up Vercel Blob or AWS S3 for file storage
5. **SMS Service**: Configure Twilio for SMS notifications (optional)

## Environment Variables (Full Production)

### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ledgerfy
```

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-here-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this
NEXTAUTH_SECRET=your-nextauth-secret-here-change-this
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Redis (Upstash)
```
REDIS_HOST=your-upstash-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-upstash-redis-password
REDIS_DB=0
```

### Storage (Vercel Blob)
```
STORAGE_PROVIDER=vercel-blob
```

### Email
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ledgerfy.com
```

### App Configuration
```
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
API_URL=https://your-app-name.vercel.app/api
CORS_ORIGIN=https://your-app-name.vercel.app
```

### Security & Limits
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,csv,xml,jpg,jpeg,png
```

### Optional Services
```
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
SENTRY_DSN=your-sentry-dsn
```

## Deployment Steps

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd ledgerfy
   vercel
   ```

4. **Set environment variables** in Vercel dashboard

5. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

## Post-Deployment

1. **Database Setup**: Run seed script if needed
2. **Test Authentication**: Verify login/signup functionality
3. **Test File Upload**: Verify document upload works
4. **Monitor Logs**: Check Vercel function logs for any issues

## Troubleshooting

- **MongoDB Connection**: Ensure MongoDB Atlas allows connections from Vercel IPs
- **Redis Connection**: Verify Upstash Redis credentials
- **File Upload**: Check storage provider configuration
- **Environment Variables**: Ensure all required variables are set in Vercel dashboard
