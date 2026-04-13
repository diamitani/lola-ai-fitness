# 🔥 Firebase Quick Setup (5 Minutes)

Your DeepSeek API is already configured! ✅  
Now you just need Firebase for user auth and data storage.

---

## Step 1: Create Firebase Project (2 min)

1. **Go to**: https://console.firebase.google.com
2. Click **"Add project"**
3. **Project name**: `lola-fitness` (or whatever you want)
4. **Google Analytics**: Disable it (click toggle off)
5. Click **"Create project"**
6. Wait ~30 seconds
7. Click **"Continue"**

---

## Step 2: Enable Authentication (1 min)

1. In the left sidebar, click **"Build" → "Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Email/Password"** to ON
5. Click **"Save"**

---

## Step 3: Create Firestore Database (1 min)

1. In the left sidebar, click **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. **Location**: Choose closest to you (e.g., `us-east1`)
5. Click **"Enable"**
6. Wait ~30 seconds

---

## Step 4: Add Security Rules (1 min)

1. Still in **Firestore Database**, click the **"Rules"** tab
2. **Delete everything** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workoutPlans/{planId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /workoutHistory/{workoutId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /chatHistory/{chatId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /progressMetrics/{metricId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /workoutSessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.hostUid == request.auth.uid || 
         resource.data.partnerUid == request.auth.uid);
    }
  }
}
```

3. Click **"Publish"**

---

## Step 5: Get Your Firebase Config (2 min)

1. Click the **⚙️ gear icon** (top left) → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **`</>`** button (Web app icon)
4. **App nickname**: `lola-web`
5. **Don't** check "Firebase Hosting"
6. Click **"Register app"**
7. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "lola-fitness-abc123.firebaseapp.com",
  projectId: "lola-fitness-abc123",
  storageBucket: "lola-fitness-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-ABC123"
};
```

8. **Copy these values** - you'll add them to Vercel next!

---

## Step 6: Add Firebase Config to Vercel (3 min)

1. **Go to**: https://vercel.com/artispreneur/lola-ai-fitness/settings/environment-variables

2. Click **"Add New"** for each variable:

| Name | Value (from Firebase config) | Environment |
|------|------------------------------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `lola-fitness-abc123.firebaseapp.com` | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | `lola-fitness-abc123` | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | `lola-fitness-abc123.appspot.com` | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123...` | Production, Preview, Development |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-ABC123` | Production, Preview, Development |
| `VITE_BACKEND_PROVIDER` | `firebase` | Production, Preview, Development |
| `VITE_DEEPSEEK_API_URL` | `https://api.deepseek.com/v1/chat/completions` | Production, Preview, Development |

**Note**: DeepSeek API key is already added! ✅

3. Click **"Save"** for each one

---

## Step 7: Redeploy on Vercel (1 min)

1. Go to **"Deployments"** tab
2. Click the **"..." menu** on the latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes for build to complete

---

## ✅ Done! Test Your App

Once redeployment completes:

1. **Open your app**: https://lola-ai-fitness.vercel.app (or your custom URL)
2. Click **"Get Started"**
3. **Sign up** with email and password
4. Complete **onboarding** (goals, equipment, experience)
5. Click **"Generate Plan"** - AI creates your workout! 💪
6. Try **Chat** - Ask "How do I do a proper squat?"
7. **Track** a workout - Build your streak!

---

## 🎊 That's It!

Your AI fitness coach is now fully functional with:
- ✅ DeepSeek AI (workout plans, chat, insights)
- ✅ Firebase (auth, database, real-time data)
- ✅ Deployed on Vercel (live on the internet!)

**Total cost**: ~$0.02/month 🎉

---

## 🆘 Quick Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**
- Double-check you copied the Firebase config correctly
- Make sure all env vars are set in Vercel
- Redeploy after adding env vars

**"White screen" or app not loading**
- Check browser console (F12) for errors
- Verify Firebase rules are published
- Make sure app has redeployed with new env vars

**Can't sign up**
- Check Email/Password auth is enabled in Firebase
- Verify Firestore database is created
- Check browser console for specific error

---

**Need help?** Check VERCEL-DEPLOYMENT-GUIDE.md for more detailed troubleshooting!
