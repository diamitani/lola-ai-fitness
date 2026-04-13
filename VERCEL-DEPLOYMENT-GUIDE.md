# 🚀 LOLA Vercel Deployment - Quick Setup

## ✅ What's Done

- ✅ Code pushed to GitHub: https://github.com/diamitani/lola-ai-fitness
- ✅ Deployed to Vercel (deploying now...)
- ✅ ROSTR agent backend integrated
- ✅ All documentation included

---

## 🔧 REQUIRED: Add Environment Variables to Vercel

The app is deployed but **needs API keys to work**. Here's what to do:

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Find your project: **lola-ai-fitness**
3. Click **Settings** → **Environment Variables**

### Step 2: Add These Variables

Copy and paste these into Vercel (replace placeholder values):

#### DeepSeek API (Required - Primary AI)
```
VITE_DEEPSEEK_API_KEY=sk-your-actual-key-here
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

**How to get DeepSeek API key:**
1. Go to: https://platform.deepseek.com
2. Sign up / Log in
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `sk-`)
5. **Cost**: ~$0.02/month per active user

---

#### Firebase (Required - Database & Auth)
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
VITE_BACKEND_PROVIDER=firebase
```

**How to get Firebase config:**
1. Go to: https://console.firebase.google.com
2. Click "Add project" → Name it (e.g., "lola-fitness")
3. Go to **Build > Authentication** → Get Started → Enable **Email/Password**
4. Go to **Build > Firestore Database** → Create database (Production mode)
5. Go to **Project Settings** (gear icon) → Your apps → Click `</>` (Web)
6. Copy all the config values
7. **Add Firestore Security Rules** (see SETUP-GUIDE.md)

---

#### Ollama (Optional - Local LLM)
```
VITE_OLLAMA_BASE_URL=http://localhost:11434
```

**Note**: Ollama only works locally, not on Vercel. Leave this for local development.

---

#### YouTube API (Optional - Exercise Videos)
```
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

**How to get YouTube API key:**
1. Go to: https://console.cloud.google.com
2. Create project → Enable "YouTube Data API v3"
3. Create credentials → API Key
4. Copy the key

**Note**: If you skip this, app will use YouTube search URLs instead (still works!)

---

### Step 3: Redeploy After Adding Variables

1. After adding all environment variables in Vercel
2. Go to **Deployments** tab
3. Click "..." menu on latest deployment → **Redeploy**
4. Wait ~2 minutes for build to complete
5. Your app will now work with real AI! 🎉

---

## 🎯 Testing Your Deployment

Once environment variables are added and redeployed:

### Test 1: Open Your App
- Go to your Vercel URL (check dashboard)
- Should see LOLA landing page

### Test 2: Sign Up
- Click "Get Started" or "Sign Up"
- Create account with email/password
- Should successfully authenticate

### Test 3: Complete Onboarding
- Enter your fitness goals (e.g., "lose fat", "build muscle")
- Select equipment (e.g., "dumbbells", "bodyweight")
- Choose experience level (beginner/intermediate/advanced)
- Set workouts per week (e.g., 3-4)
- Submit

### Test 4: Generate Workout Plan
- Click "Generate Plan" or "My Plan"
- AI should create personalized workout (takes 5-10 sec)
- Plan should match your goals, equipment, and level

### Test 5: Chat with Lola
- Go to Chat page
- Ask: "How do I do a proper squat?"
- Should get AI response with form guidance

### Test 6: Track Progress
- Complete a workout
- Check progress page
- Should see streak, stats, and AI insights

---

## 📊 Monitoring & Costs

### DeepSeek API Usage
- View usage: https://platform.deepseek.com/usage
- Typical costs: ~$0.02/month per active user
- Very affordable!

### Firebase Usage
- View usage: Firebase Console → Usage & billing
- Free tier: 50K reads/day, 20K writes/day
- Should stay in free tier for personal use

### Vercel Usage
- View: Vercel Dashboard → Usage
- Free tier: 100GB bandwidth, unlimited deployments
- Should stay in free tier

---

## 🛠️ Local Development

Want to run LOLA locally too?

### 1. Clone the repo
```bash
git clone https://github.com/diamitani/lola-ai-fitness.git
cd lola-ai-fitness
npm install
```

### 2. Create .env
```bash
cp .env.example .env
# Edit .env with your API keys (same as Vercel)
```

### 3. Install Ollama (Optional - for local LLM)
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

### 4. Run locally
```bash
npm run dev
# Open: http://localhost:5173
```

**Benefit**: With Ollama installed, you have a free local AI fallback!

---

## 🚨 Troubleshooting

### "DeepSeek API key not configured"
- Check Vercel env vars are set correctly
- Make sure key starts with `sk-`
- Redeploy after adding

### "Firebase: Error (auth/invalid-api-key)"
- Verify all Firebase env vars are correct
- Check for typos
- Make sure no extra spaces
- Redeploy after fixing

### "White screen" or app not loading
- Open browser console (F12)
- Check for errors
- Verify all required env vars are set in Vercel
- Redeploy

### Workout plan generation fails
- Check DeepSeek API key is valid
- Check you have credits on DeepSeek account
- Check browser console for errors

### Firebase auth not working
- Verify Email/Password is enabled in Firebase Console
- Check Firestore database is created
- Verify security rules are published

---

## 📚 Next Steps

### Immediate (Today)
1. ✅ Add environment variables to Vercel (see Step 2 above)
2. ✅ Redeploy on Vercel
3. ✅ Test the app (see Testing section)
4. ✅ Create your first workout plan

### This Week
1. Add Firebase security rules (see SETUP-GUIDE.md)
2. Customize app (colors, branding)
3. Invite friends to test
4. Set up custom domain (optional)

### Long-term
1. Monitor costs and usage
2. Collect user feedback
3. Add new features
4. Scale as needed

---

## 🎊 You're All Set!

Your LOLA AI Fitness Coach is now:
- ✅ Live on Vercel
- ✅ Code on GitHub
- ✅ Ready to configure with API keys
- ✅ Built with ROSTR framework
- ✅ Multi-LLM support (DeepSeek + Ollama)

**Total time to full deployment**: ~10 minutes once you have API keys

**Monthly cost**: ~$0.02/user (DeepSeek) + $0 (Firebase free tier) + $0 (Vercel free tier)

---

## 📞 Support

**Questions?**
- Check SETUP-GUIDE.md
- Check BUILD-COMPLETE.md
- Check Firebase/Vercel/DeepSeek docs

**Issues?**
- GitHub repo: https://github.com/diamitani/lola-ai-fitness
- Open an issue with details

**Want to contribute?**
- Fork the repo
- Make improvements
- Submit PR

---

*Built with ROSTR Agent Framework*  
*DeepSeek + Ollama + Firebase + React + Vercel*  
*Your AI fitness coach is ready! 💪*
