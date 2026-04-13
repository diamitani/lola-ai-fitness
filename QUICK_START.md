# Quick Start Guide - Get Lola Running in 10 Minutes

This guide will help you get Lola up and running as quickly as possible.

## 1. Prerequisites ✅

- [ ] Node.js 18+ installed
- [ ] Firebase account
- [ ] DeepSeek API key

## 2. Install Dependencies (2 min)

```bash
cd /Users/patmini/Desktop/Products/LOLA
npm install
```

## 3. Set Up Firebase (3 min)

### Create Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → Name it "lola-fitness" → Create

### Enable Auth
1. **Build > Authentication** → Get Started
2. Enable **Email/Password**
3. (Optional) Enable **Google**

### Create Database
1. **Build > Firestore Database** → Create database
2. Start in **Production mode**
3. Choose your region

### Get Config
1. **Project Settings** (gear icon)
2. Under "Your apps" → Click "</>"
3. Register app → Copy the config object

## 4. Get DeepSeek API Key (1 min)

1. Go to https://platform.deepseek.com/api_keys
2. Sign up / Log in
3. Create API key → Copy it

## 5. Configure Environment (2 min)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# From Firebase config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# From DeepSeek
VITE_DEEPSEEK_API_KEY=...
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Backend
VITE_BACKEND_PROVIDER=firebase
```

## 6. Add Firestore Security Rules (1 min)

In Firebase Console → **Firestore Database** → **Rules** tab:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workoutSessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.hostUid == request.auth.uid || 
         resource.data.partnerUid == request.auth.uid);
      
      match /messages/{messageId} {
        allow read, create: if request.auth != null;
      }
    }
  }
}
```

Click **Publish**

## 7. Run the App! (1 min)

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## 🎉 You're Done!

Now you can:
1. Sign up with email/password
2. Complete the onboarding
3. Generate a workout plan
4. Start tracking workouts
5. Chat with Lola
6. Connect with a partner

## Optional Enhancements

### Add YouTube Video Tutorials
1. Go to https://console.cloud.google.com
2. Create/select project
3. Enable "YouTube Data API v3"
4. Create API key
5. Add to `.env`: `VITE_YOUTUBE_API_KEY=...`

### Use Anthropic Claude Instead
1. Get API key from https://console.anthropic.com
2. Add to `.env`: `VITE_ANTHROPIC_API_KEY=...`
3. Change provider in code: `callLLM(..., 'anthropic')`

## Deploy to Vercel (5 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Double-check your Firebase config in `.env`

**Error: "DeepSeek API key not configured"**
- Make sure `VITE_DEEPSEEK_API_KEY` is set in `.env`

**Error: "Permission denied"**
- Check Firestore security rules are published

**App loads but white screen**
- Check browser console for errors
- Make sure all env variables start with `VITE_`

## Need Help?

Check:
- Browser console (F12)
- Firebase Console logs
- README.md for detailed docs
- DEPLOYMENT.md for production setup

Enjoy Lola! 💪🌸
