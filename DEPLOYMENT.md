# Lola - Production Deployment Guide

## Prerequisites

1. **Firebase Account** - [console.firebase.google.com](https://console.firebase.google.com)
2. **DeepSeek API Key** - [platform.deepseek.com](https://platform.deepseek.com/api_keys)
3. **Vercel Account** - [vercel.com](https://vercel.com)
4. **YouTube API Key** (Optional) - [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it (e.g., "lola-fitness")
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Google** sign-in

### 1.3 Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll add rules next)
4. Select your region
5. Click "Enable"

### 1.4 Set Firestore Security Rules

In Firestore > Rules, add these security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout sessions - anyone can read waiting sessions, only participants can write
    match /workoutSessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.hostUid == request.auth.uid || 
         resource.data.partnerUid == request.auth.uid);
      
      // Session messages
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

### 1.5 Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click "</>" to add a Web app
4. Register your app
5. Copy all the config values (you'll need these for environment variables)

## Step 2: Get API Keys

### 2.1 DeepSeek API (Required)

1. Go to [platform.deepseek.com](https://platform.deepseek.com/api_keys)
2. Sign up / Sign in
3. Create a new API key
4. Copy the key (store it securely!)

### 2.2 YouTube API (Optional but recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services > Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services > Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - (Recommended) Restrict the key to YouTube Data API v3

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Set Environment Variables in Vercel

You can do this via CLI or web dashboard.

**Via Web Dashboard:**
1. Go to your project on [vercel.com](https://vercel.com)
2. Go to Settings > Environment Variables
3. Add all variables from `.env.example`

**Via CLI:**
```bash
# In your project directory
vercel env add VITE_FIREBASE_API_KEY
# Paste your value when prompted
# Repeat for all environment variables
```

Required variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_DEEPSEEK_API_KEY`
- `VITE_DEEPSEEK_API_URL` (use: https://api.deepseek.com/v1/chat/completions)
- `VITE_BACKEND_PROVIDER` (use: firebase)

Optional variables:
- `VITE_YOUTUBE_API_KEY`
- `VITE_ANTHROPIC_API_KEY`

### 3.4 Deploy

```bash
# Build locally first to test
npm run build

# Deploy to production
vercel --prod
```

## Step 4: Post-Deployment

### 4.1 Test the App

1. Visit your Vercel deployment URL
2. Create a test account
3. Complete onboarding
4. Generate a workout plan
5. Test all features:
   - ✅ Workout tracking
   - ✅ Video tutorials
   - ✅ AI insights
   - ✅ Partner workouts
   - ✅ Chat with Lola

### 4.2 Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Errors

**Error:** "Missing environment variables"
- **Solution:** Make sure all required env vars are set in Vercel

**Error:** "Module not found"
- **Solution:** Run `npm install` locally and redeploy

### Firebase Errors

**Error:** "Permission denied"
- **Solution:** Check Firestore security rules

**Error:** "Firebase: Error (auth/invalid-api-key)"
- **Solution:** Double-check your Firebase config in environment variables

### API Errors

**Error:** "DeepSeek API key not configured"
- **Solution:** Add `VITE_DEEPSEEK_API_KEY` to environment variables

**Error:** "YouTube API quota exceeded"
- **Solution:** The app works without YouTube API (uses search URLs instead)

## Monitoring

- **Firebase Console:** Monitor authentication and database usage
- **Vercel Analytics:** Track page views and performance
- **Browser Console:** Check for any client-side errors

## Cost Estimates

- **Firebase:** Free tier includes:
  - 50K reads/day
  - 20K writes/day
  - 1 GB storage
  
- **DeepSeek API:** ~$0.15 per 1M tokens (very affordable)

- **Vercel:** Free tier includes:
  - 100 GB bandwidth
  - Unlimited deployments

For a single user or small group, everything should stay within free tiers!

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Firebase logs
3. Check Vercel deployment logs
4. Ensure all environment variables are set correctly
