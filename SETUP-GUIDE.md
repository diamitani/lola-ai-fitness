# LOLA Setup Guide - Complete Installation

This guide walks you through setting up LOLA - AI Fitness Coach with all required services (DeepSeek, Ollama, Firebase).

---

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **Git** (optional, for version control)
- **Text Editor** (VS Code recommended)

---

## Step 1: Get DeepSeek API Key (5 minutes)

DeepSeek is the primary AI provider for LOLA (affordable, fast, high-quality).

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. **Sign up** with email or GitHub
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. **Copy the key** (you won't see it again!)
6. **Save it** somewhere safe (you'll add it to `.env` later)

**Cost**: ~$0.14 per 1M input tokens, ~$0.28 per 1M output tokens
- Typical workout plan: ~1,800 tokens (~$0.0005)
- Typical chat response: ~300 tokens (~$0.00008)
- Very affordable for personal use!

---

## Step 2: Install Ollama (Local LLM Fallback) (5 minutes)

Ollama provides a free, local LLM for offline mode and development.

### macOS / Linux

1. Go to [ollama.ai](https://ollama.ai)
2. **Download** and install Ollama
3. Open terminal and run:
   ```bash
   ollama pull llama3
   ```
4. Start Ollama server:
   ```bash
   ollama serve
   ```

### Windows

1. Download from [ollama.ai/download/windows](https://ollama.ai/download/windows)
2. Install and run Ollama
3. Open PowerShell and run:
   ```powershell
   ollama pull llama3
   ```

**Verify Installation**:
```bash
curl http://localhost:11434/api/tags
```

You should see a JSON response listing available models.

**Note**: Ollama runs locally on your machine, so it's:
- ✅ Free
- ✅ Private (data stays on your device)
- ✅ Offline-capable
- ⚠️ Slower than DeepSeek API
- ⚠️ Requires ~4-8GB RAM

---

## Step 3: Set Up Firebase (10 minutes)

Firebase handles authentication, database, and user state.

### 3.1 Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project**
3. Enter project name: `lola-fitness` (or your choice)
4. **Disable** Google Analytics (optional)
5. Click **Create Project**

### 3.2 Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Google** sign-in

### 3.3 Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click **Create Database**
3. Choose **Production mode** (we'll add security rules next)
4. Select your **region** (choose closest to you)
5. Click **Enable**

### 3.4 Add Firestore Security Rules

1. In **Firestore Database**, click **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout plans
    match /workoutPlans/{planId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Workout history
    match /workoutHistory/{workoutId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Chat history
    match /chatHistory/{chatId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Progress metrics
    match /progressMetrics/{metricId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Workout sessions (partner workouts)
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

3. Click **Publish**

### 3.5 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your Apps**
3. Click **</>** (Web) to add a web app
4. Register app name: `lola-web`
5. **Copy** the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

**Save these values** for Step 5.

---

## Step 4: (Optional) Get YouTube API Key (5 minutes)

YouTube API enables exercise video tutorials. If you skip this, LOLA will generate search URLs instead.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services > Library**
4. Search for **YouTube Data API v3**
5. Click **Enable**
6. Go to **APIs & Services > Credentials**
7. Click **Create Credentials > API Key**
8. **Copy the API key**
9. (Recommended) Click **Edit API Key** and restrict to **YouTube Data API v3**

**Cost**: Free tier includes 10,000 quota units/day (plenty for personal use)

---

## Step 5: Configure LOLA Environment (5 minutes)

1. Navigate to your LOLA directory:
   ```bash
   cd /Users/patmini/Desktop/LOLA
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in a text editor:
   ```bash
   nano .env
   # or use your preferred editor: code .env, vim .env, etc.
   ```

4. Fill in your values:

```env
# DeepSeek API
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Ollama (leave as default if running locally)
VITE_OLLAMA_BASE_URL=http://localhost:11434

# Firebase (from Step 3.5)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=lola-fitness.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lola-fitness
VITE_FIREBASE_STORAGE_BUCKET=lola-fitness.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

VITE_BACKEND_PROVIDER=firebase

# YouTube API (optional, from Step 4)
VITE_YOUTUBE_API_KEY=AIzaSy...
```

5. **Save and close** the file

---

## Step 6: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages:
- React, TypeScript, Vite
- Firebase SDK
- Routing, icons, etc.

---

## Step 7: Run LOLA (1 minute)

### Development Mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Step 8: Test the Setup

### Test 1: Sign Up
1. Click **Sign Up** or **Get Started**
2. Enter email and password
3. Create account

**Expected**: You're logged in and see onboarding

### Test 2: Complete Onboarding
1. Fill in:
   - Goals (e.g., "lose fat", "build muscle")
   - Equipment (e.g., "dumbbells", "bodyweight only")
   - Experience level (beginner, intermediate, advanced)
   - Workouts per week (e.g., 3-4)
   - Time per workout (e.g., "30-45 min")
2. Submit

**Expected**: Profile saved, redirected to home/dashboard

### Test 3: Generate Workout Plan
1. Click **Generate Plan** or **My Plan**
2. Wait 5-10 seconds

**Expected**: 
- AI generates personalized workout plan
- Workouts include: warmup, exercises, cooldown, video links
- Plan matches your goals and equipment

### Test 4: Chat with Lola
1. Go to **Chat** page
2. Ask: "How do I do a proper squat?"

**Expected**:
- Lola responds in 2-4 seconds
- Answer includes form cues, safety tips, encouragement
- Response is warm and educational

### Test 5: Complete a Workout
1. Go to **My Plan**
2. Click on a workout day
3. Mark exercises as complete
4. Save workout

**Expected**:
- Workout logged to history
- Streak updated
- Progress metrics recalculated

### Test 6: Check Progress
1. Go to **Track Progress** page

**Expected**:
- See current streak
- See total workouts completed
- See weekly/monthly completion rate
- AI-generated insights appear

---

## Troubleshooting

### "DeepSeek API key not configured"
- **Check**: `.env` file has `VITE_DEEPSEEK_API_KEY=sk-...`
- **Check**: No typos in the key
- **Restart**: Dev server (`npm run dev`) to reload environment

### "Firebase: Error (auth/invalid-api-key)"
- **Check**: All Firebase env vars are filled correctly
- **Check**: No extra spaces or quotes around values
- **Verify**: Firebase project is active in console

### "Ollama connection failed"
- **Check**: Ollama is running (`ollama serve`)
- **Check**: URL is `http://localhost:11434`
- **Try**: `curl http://localhost:11434/api/tags` to verify

### "YouTube API quota exceeded"
- **Expected**: Free tier is 10,000 units/day
- **Solution**: App will use fallback (YouTube search URLs)
- **Alternative**: Disable YouTube integration (still works)

### Workout plan generation is slow
- **DeepSeek**: Should take 5-10 seconds
- **Ollama**: Can take 15-30 seconds (runs locally)
- **Check**: Which provider is being used (logs in console)
- **Optimize**: Use DeepSeek for production, Ollama for dev

### App loads but white screen
- **Check**: Browser console (F12) for errors
- **Check**: All env vars start with `VITE_` prefix
- **Verify**: Firebase config is correct
- **Try**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

---

## Optional: Deploy to Production

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all vars from `.env`

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. Build the app:
   ```bash
   npm run build
   ```

2. Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

3. Add environment variables in Netlify dashboard

### Option 3: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize hosting:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Next Steps

✅ **You're all set!** LOLA is running with:
- DeepSeek AI for intelligent workout plans and coaching
- Ollama for local fallback
- Firebase for user auth and data storage
- (Optional) YouTube API for exercise videos

**What to do next:**
1. Complete your first workout plan
2. Track a few workouts to build your streak
3. Chat with Lola about fitness questions
4. Check your progress insights
5. Invite friends (partner workout feature)

**For developers:**
- Explore `backend/services/` to understand AI integration
- Read `NPAO-ORCHESTRATION.md` for workflow logic
- Check `rostr-hub/` for agent state management
- Review `system-instructions.md` for Lola's behavior

---

## Support

**Issues?**
- Check browser console for errors
- Review Firebase console logs
- Verify environment variables
- Test with curl commands

**Questions?**
- Read `README.md` for detailed docs
- Check `rostr-hub/context/domain-knowledge.md` for fitness info
- Review `DEPLOYMENT.md` for production setup

**Contributing:**
- Fork the repo
- Create feature branch
- Submit PR with description

---

*Built with the ROSTR Agent Framework*  
*DeepSeek + Ollama + Firebase = Affordable, Private, Powerful AI Coaching* 💪
