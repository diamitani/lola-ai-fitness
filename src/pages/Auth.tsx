import React, { useState } from 'react';
import { PrimaryBtn } from '../components/shared/PrimaryBtn';
import { C, F, GS } from '../theme';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../services';

interface AuthProps {
  onSuccess: () => void;
}

export function Auth({ onSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <style>
        {GS}
      </style>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🌸</div>
          <h1 style={{ fontFamily: F.display, fontSize: 38, color: C.rose }}>Lola</h1>
          <p style={{ color: C.muted, fontSize: 16, marginTop: 8 }}>
            Your personal AI fitness coach
          </p>
        </div>

        <div
          style={{
            background: C.surface,
            borderRadius: 20,
            padding: '30px 28px',
            border: `1.5px solid ${C.border}`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.04)`,
          }}
        >
          <div style={{ display: 'flex', marginBottom: 24 }}>
            <button
              onClick={() => setIsSignUp(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: !isSignUp ? C.rose : 'transparent',
                color: !isSignUp ? '#fff' : C.muted,
                border: 'none',
                fontFamily: F.body,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                borderRadius: 12,
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              style={{
                flex: 1,
                padding: '12px',
                background: isSignUp ? C.rose : 'transparent',
                color: isSignUp ? '#fff' : C.muted,
                border: 'none',
                fontFamily: F.body,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                borderRadius: 12,
                transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: 13,
                    color: C.muted,
                    marginBottom: 6,
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1.5px solid ${C.border}`,
                    fontFamily: F.body,
                    fontSize: 15,
                    color: C.text,
                    background: C.surface,
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: 13,
                  color: C.muted,
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  fontFamily: F.body,
                  fontSize: 15,
                  color: C.text,
                  background: C.surface,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: 13,
                  color: C.muted,
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  fontFamily: F.body,
                  fontSize: 15,
                  color: C.text,
                  background: C.surface,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: C.roseLight,
                  color: C.roseDark,
                  fontSize: 13,
                  padding: '12px 16px',
                  borderRadius: 12,
                  marginBottom: 18,
                }}
              >
                {error}
              </div>
            )}

            <PrimaryBtn type="submit" disabled={loading} onClick={() => {}}>
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </PrimaryBtn>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>or continue with</p>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                background: C.surface,
                color: C.text,
                fontFamily: F.body,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 24 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: 'none',
                border: 'none',
                color: C.rose,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: F.body,
                fontSize: 13,
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 24 }}>
          By continuing, you agree to Lola's Terms & Privacy.
        </p>
      </div>
    </div>
  );
}