# Lola - AI Fitness Coach 🌸

A personalized AI fitness coaching web app that builds custom workout plans, tracks progress, provides real-time motivation, and connects you with workout partners. Powered by LLMs (DeepSeek/Anthropic) and built with love.

## ✨ Features

### 🎯 Core Features
- **Personalized Onboarding**: Capture fitness goals, equipment, environment, and preferences
- **AI-Generated Workout Plans**: Custom weekly plans tailored to your profile, goals, and available equipment
- **Real-Time Progress Tracking**: Visual dashboards, streak tracking, workout history, and statistics
- **Chat with Lola**: Ask fitness, nutrition, and form questions - get instant AI-powered answers
- **Secure Authentication**: Email/password and Google OAuth via Firebase

### 💪 New Advanced Features
- **YouTube Video Tutorials**: Automatically find exercise demonstration videos for proper form
- **AI-Powered Insights**: Get personalized recommendations, tips, and achievements based on your progress
- **Partner Workouts**: Connect with a workout buddy in real-time for accountability and motivation
- **Live Workout Sessions**: Chat with your partner during workouts, complete exercises together
- **Smart Progress Analytics**: Track streaks, personal records, weekly completion, and monthly trends

### 🎨 Design
- **Beautiful UI**: Modern, clean interface with rose/peach gradient theme
- **Fully Responsive**: Perfect experience on mobile, tablet, and desktop
- **Smooth Animations**: Delightful interactions and transitions
- **Dark Mode Cards**: High-contrast workout cards for easy reading

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Custom design system with inline styles
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (with optional Supabase support)
- **AI Integration**: DeepSeek API (primary), Anthropic Claude (optional)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Video Search**: YouTube Data API v3 (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase account
- DeepSeek API key

### Installation

1. **Clone the repository**
   ```bash
   cd LOLA
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📋 Environment Variables

Required variables (add to `.env`):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# AI Provider (DeepSeek recommended)
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Backend Provider
VITE_BACKEND_PROVIDER=firebase
```

Optional variables:

```env
# YouTube API (for video tutorials)
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Anthropic Claude API (alternative to DeepSeek)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

## 📁 Project Structure

```
src/
├── components/
│   └── shared/          # Reusable UI components
├── contexts/            # React Context (Auth)
├── pages/
│   ├── Auth.tsx         # Login/signup
│   ├── Onboarding.tsx   # User profile setup
│   ├── Home.tsx         # Dashboard with AI insights
│   ├── MyPlan.tsx       # Workout plans with video tutorials
│   ├── Partner.tsx      # Live partner workout sessions
│   ├── Chat.tsx         # AI fitness coach chat
│   ├── Track.tsx        # Progress tracking & analytics
│   └── Landing.tsx      # Landing page
├── services/
│   ├── firebase.ts      # Firebase configuration
│   ├── llm.ts           # AI provider integration
│   ├── planGenerator.ts # Workout plan generation
│   ├── workoutTracking.ts # Progress tracking logic
│   ├── youtube.ts       # Video search integration
│   ├── insights.ts      # AI insights generation
│   └── partnerWorkout.ts # Real-time partner sessions
├── types/               # TypeScript interfaces
├── config/              # App configuration
└── theme.ts             # Design system (colors, fonts)
```

## 🔥 Key Features Explained

### AI-Powered Workout Plans
- Custom plans based on goals (lose fat, build muscle, tone, etc.)
- Adapts to available equipment (dumbbells, resistance bands, bodyweight, etc.)
- Considers experience level (beginner to advanced)
- Includes warmup, exercises, cooldown, and motivation

### Real-Time Progress Tracking
- **Streak Tracking**: See your current and longest workout streaks
- **Weekly View**: Visual calendar showing completed workouts
- **Monthly Trends**: 12-week activity graph
- **Stats Cards**: Total workouts, average duration, personal records

### Partner Workout Sessions
- Create or join live workout sessions
- Real-time chat with your workout buddy
- Complete exercises together
- Accountability and motivation

### YouTube Integration
- Automatically searches for exercise demonstration videos
- One-click access to proper form tutorials
- Works with or without API key (fallback to search URLs)

### AI Insights
- Personalized motivation based on your progress
- Smart tips to improve workouts
- Achievement celebrations
- Gentle warnings about rest and recovery

## 🔒 Firebase Security

Add these Firestore security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout sessions
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

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.example`
   - Redeploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📱 Usage

1. **Sign up** with email or Google
2. **Complete onboarding** - set your goals, equipment, and preferences
3. **Generate your plan** - AI creates a custom workout schedule
4. **Start working out** - Follow exercises with video tutorials
5. **Track progress** - Mark exercises complete, save workouts
6. **Chat with Lola** - Ask questions anytime
7. **Connect with a partner** - Find a workout buddy for motivation

## 🎯 Roadmap

- [ ] Mobile apps (iOS/Android with React Native)
- [ ] Nutrition tracking and meal plans
- [ ] Integration with fitness wearables
- [ ] Social features (follow friends, share achievements)
- [ ] Custom exercise library
- [ ] Video form analysis with AI
- [ ] Voice coaching during workouts

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 💰 Cost Estimates

**Free Tier Friendly!** For personal use or small groups:

- **Firebase**: Free tier includes 50K reads/day, 20K writes/day
- **DeepSeek API**: ~$0.15 per 1M tokens (very affordable)
- **Vercel**: Free tier includes 100GB bandwidth
- **YouTube API**: 10,000 quota units/day (free)

Everything stays within free tiers for typical personal use!

## 📄 License

MIT

## 💖 Made with Love

Built for my girlfriend to help her stay motivated and reach her fitness goals. Now available for everyone! 🌸💪
