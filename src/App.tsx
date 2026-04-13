import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { MyPlan } from './pages/MyPlan';
import { Partner } from './pages/Partner';
import { Chat } from './pages/Chat';
import { Track } from './pages/Track';
import { C, F, GS } from './theme';
import { TABS, TAB_ICONS } from './config/tabs.tsx';
import type { Profile, Plan } from './types';
import { buildPlan } from './services/planGenerator';
import { getUserProfile, updateUserProfile, updateUserPlan, getUserId } from './services';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${C.roseLight}`, borderTopColor: C.rose, borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function LolaApp() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [tab, setTab] = useState<string>('Home');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  async function loadUserData() {
    if (!user) return;
    const data = await getUserProfile(getUserId(user));
    if (data?.profile) {
      setProfile(data.profile);
    }
    if (data?.plan) {
      setPlan(data.plan);
    }
  }

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  async function handleOnboardingComplete(profileData: Profile) {
    if (!user) return;
    setProfile(profileData);
    await updateUserProfile(getUserId(user), profileData);
    generatePlan(profileData);
  }

  async function generatePlan(prof?: Profile) {
    const p = prof || profile;
    if (!p || !user) return;
    setGenerating(true);
    setGenError('');
    try {
      const result = await buildPlan(p);
      setPlan(result);
      await updateUserPlan(getUserId(user), result);
    } catch (e) {
      console.error(e);
      setGenError("Couldn't build the plan. Tap Refresh to try again.");
    }
    setGenerating(false);
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 84 }}>
      <style>
        {GS}
      </style>

      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(253,248,245,0.95)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${C.border}`,
          padding: '13px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: F.display,
            fontSize: 24,
            color: C.rose,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          Lola
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {genError && <span style={{ fontSize: 12, color: C.roseDark }}>⚠ {genError}</span>}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg,${C.rose},${C.peach})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={logout}
          >
            {profile.name[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tab === 'Home' && (
        <Home
          profile={profile}
          plan={plan}
          generating={generating}
          onGeneratePlan={() => generatePlan()}
          setTab={setTab}
        />
      )}
      {tab === 'My Plan' && (
        <MyPlan profile={profile} plan={plan} onGenerate={() => generatePlan()} generating={generating} />
      )}
      {tab === 'Partner' && <Partner profile={profile} />}
      {tab === 'Chat' && <Chat profile={profile} plan={plan} />}
      {tab === 'Track' && <Track profile={profile} />}

      {/* Bottom nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0 18px',
        }}
      >
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: tab === t ? C.rose : C.muted,
              transition: 'color 0.2s',
              fontFamily: F.body,
              minWidth: 52,
            }}
          >
            <div
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                background: tab === t ? C.roseLight : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              {TAB_ICONS[t]}
            </div>
            <span style={{ fontSize: 10, fontWeight: tab === t ? 700 : 400 }}>{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth onSuccess={() => window.location.href = '/app'} />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <LolaApp />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;