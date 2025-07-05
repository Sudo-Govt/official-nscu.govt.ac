# NSCU University Portal - Deployment Guide

## Your PostgreSQL Database Integration is Complete!

Your university portal now connects to your own PostgreSQL database instead of mock data. Here's what's been set up:

### ✅ What's Ready:
- **API Service Layer**: Connects frontend to your PostgreSQL database
- **Authentication System**: Real JWT-based login with password hashing
- **User Management**: Create, update, and manage real users
- **SMTP Settings**: Store email configuration in your database
- **Database Schema**: Auto-creates all necessary tables

### 🚀 Deployment Steps:

#### Step 1: Deploy the Backend API
You need to deploy the `backend/` folder to a hosting service. Here are your options:

**Option A: Railway (Recommended - $5/month)**
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `backend/` folder
4. Add environment variables in Railway dashboard
5. Your API will be at: `https://your-app.railway.app`

**Option B: Render (Free tier available)**
1. Sign up at [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your repository and select the `backend/` folder
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

**Option C: Vercel/Netlify Functions**
- Convert API routes to serverless functions
- Good for low traffic (perfect for your use case)

#### Step 2: Environment Variables
Set these in your hosting platform:

```
DATABASE_URL=postgresql://rajvardhan_nscu:Sanam%401985@premium12.web-hosting.com:5432/rajvardhan_nscu_website_db
JWT_SECRET=your-super-secure-random-string-here
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.lovable.app
```

#### Step 3: Update Frontend Configuration
In your Lovable project, you'll need to set the API URL. Create a `.env` file or update the API service:

```typescript
// In src/services/api.ts, update this line:
const API_BASE_URL = 'https://your-backend-url.railway.app/api';
```

### 🔒 Security Notes:
- Your database credentials are already in the backend code
- Change the JWT_SECRET to something secure
- The API automatically creates your admin user (admin/admin123)
- All passwords are properly hashed using bcrypt

### 📊 Database Tables Created:
- `users` - System users (admin, students, faculty)
- `students` - Student-specific information
- `courses` - Course catalog
- `student_courses` - Student enrollments
- `fee_transactions` - Payment records
- `smtp_settings` - Email configuration

### 🎯 What This Achieves:
- ✅ No dependency on third-party services
- ✅ Your own database, your own control
- ✅ No sleeping/pausing issues
- ✅ Cost-effective (just hosting costs)
- ✅ Full data ownership
- ✅ Scalable for university needs

### 🔧 Local Development:
To run the backend locally:
```bash
cd backend
npm install
npm start
```

Your API will be available at `http://localhost:3001`

### 📝 Next Steps:
1. Deploy the backend to your chosen platform
2. Update the API_BASE_URL in your frontend
3. Test the login with admin/admin123
4. Create additional users through the admin panel
5. Configure SMTP settings for email functionality

### 💡 Why This Approach is Better:
- No vendor lock-in
- Uses your existing database investment
- Perfect for low-traffic university portal
- Full control over data and functionality
- Cost-effective long-term solution

Your university portal is now ready for real-world use with your own PostgreSQL database!