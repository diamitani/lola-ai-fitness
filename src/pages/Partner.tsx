import { useState, useEffect } from 'react';
import { C, F } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { PrimaryBtn } from '../components/shared/PrimaryBtn';
import { Spinner } from '../components/shared/Spinner';
import {
  createWorkoutSession,
  getAvailableSessions,
  joinWorkoutSession,
  leaveWorkoutSession,
  completeWorkoutSession,
  subscribeToSession,
  subscribeToSessionMessages,
  sendSessionMessage,
  type WorkoutSession,
  type SessionMessage,
} from '../services/partnerWorkout';
import type { Profile } from '../types';
import { Users, Video, MessageCircle, X, Check } from 'lucide-react';

interface PartnerProps {
  profile: Profile;
}

export function Partner({ profile }: PartnerProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'lobby' | 'session'>('lobby');
  const [availableSessions, setAvailableSessions] = useState<WorkoutSession[]>([]);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load available sessions
  useEffect(() => {
    if (view === 'lobby') {
      loadSessions();
      const interval = setInterval(loadSessions, 5000); // Refresh every 5s
      return () => clearInterval(interval);
    }
  }, [view]);

  // Subscribe to current session
  useEffect(() => {
    if (currentSession) {
      const unsubscribe = subscribeToSession(currentSession.id, (session) => {
        if (!session) {
          // Session was deleted
          alert('Session ended by host');
          setView('lobby');
          setCurrentSession(null);
        } else {
          setCurrentSession(session);
        }
      });

      const unsubscribeMessages = subscribeToSessionMessages(currentSession.id, setMessages);

      return () => {
        unsubscribe();
        unsubscribeMessages();
      };
    }
  }, [currentSession?.id]);

  async function loadSessions() {
    try {
      const sessions = await getAvailableSessions();
      setAvailableSessions(sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  async function handleCreateSession() {
    if (!user) return;
    setLoading(true);
    try {
      const sessionId = await createWorkoutSession(
        user.uid,
        profile.name,
        'General Workout'
      );
      const unsubscribe = subscribeToSession(sessionId, (session) => {
        if (session) {
          setCurrentSession(session);
          setView('session');
        }
      });
      // Initial fetch
      setTimeout(unsubscribe, 100);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSession(session: WorkoutSession) {
    if (!user) return;
    setLoading(true);
    try {
      await joinWorkoutSession(session.id, user.uid, profile.name);
      setCurrentSession({ ...session, partnerUid: user.uid, partnerName: profile.name });
      setView('session');
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session');
    } finally {
      setLoading(false);
    }
  }

  async function handleLeaveSession() {
    if (!user || !currentSession) return;
    try {
      await leaveWorkoutSession(currentSession.id, user.uid);
      setCurrentSession(null);
      setView('lobby');
      setMessages([]);
    } catch (error) {
      console.error('Failed to leave session:', error);
    }
  }

  async function handleCompleteSession() {
    if (!currentSession) return;
    try {
      await completeWorkoutSession(currentSession.id);
      alert('Workout completed! Great job! 🎉');
      handleLeaveSession();
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  }

  async function handleSendMessage() {
    if (!user || !currentSession || !messageInput.trim()) return;
    try {
      await sendSessionMessage(currentSession.id, user.uid, profile.name, messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  if (view === 'session' && currentSession) {
    const isHost = currentSession.hostUid === user?.uid;
    const isActive = currentSession.status === 'active';

    return (
      <div style={{ padding: '22px 20px', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 24 }}>
              {isActive ? '💪 Active Session' : '⏳ Waiting for Partner'}
            </h2>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
              {currentSession.workoutType}
            </p>
          </div>
          <button
            onClick={handleLeaveSession}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={24} color={C.muted} />
          </button>
        </div>

        {/* Participants */}
        <div style={{
          background: C.surface,
          borderRadius: 16,
          padding: '16px',
          border: `1.5px solid ${C.border}`,
          marginBottom: 18,
        }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Participants</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: 20,
              }}>
                👤
              </div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>{currentSession.hostName}</p>
              <p style={{ fontSize: 11, color: C.muted }}>Host</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: currentSession.partnerName ? `linear-gradient(135deg,${C.green},#10B981)` : C.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: 20,
              }}>
                {currentSession.partnerName ? '👤' : '?'}
              </div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>
                {currentSession.partnerName || 'Waiting...'}
              </p>
              <p style={{ fontSize: 11, color: C.muted }}>Partner</p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div style={{
          background: C.surface,
          borderRadius: 16,
          border: `1.5px solid ${C.border}`,
          marginBottom: 18,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontWeight: 700, fontSize: 13 }}>
              <MessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Chat
            </p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {messages.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                No messages yet. Say hi! 👋
              </p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 12, color: C.muted }}>
                    {msg.name}
                  </p>
                  <p style={{ fontSize: 14, marginTop: 2 }}>{msg.message}</p>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                fontSize: 14,
                fontFamily: F.body,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: messageInput.trim() ? `linear-gradient(135deg,${C.rose},${C.peach})` : C.border,
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: messageInput.trim() ? 'pointer' : 'default',
                fontFamily: F.body,
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Actions */}
        {isActive && (
          <PrimaryBtn onClick={handleCompleteSession} style={{ width: '100%' }}>
            <Check size={18} style={{ marginRight: 8 }} />
            Complete Workout
          </PrimaryBtn>
        )}
      </div>
    );
  }

  // Lobby view
  return (
    <div style={{ padding: '22px 20px', maxWidth: 520, margin: '0 auto' }}>
      <h2 style={{ fontFamily: F.display, fontSize: 28, marginBottom: 4 }}>
        Workout Partner
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        Connect with a buddy for motivation and accountability! 💪
      </p>

      <PrimaryBtn
        onClick={handleCreateSession}
        disabled={loading}
        style={{ width: '100%', marginBottom: 22 }}
      >
        {loading ? 'Creating...' : 'Start New Session ✨'}
      </PrimaryBtn>

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          Available Sessions ({availableSessions.length})
        </p>
      </div>

      {availableSessions.length === 0 ? (
        <div style={{
          background: C.surface,
          borderRadius: 16,
          padding: '40px 20px',
          border: `1.5px solid ${C.border}`,
          textAlign: 'center',
        }}>
          <Users size={40} color={C.muted} style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No active sessions</p>
          <p style={{ color: C.muted, fontSize: 13 }}>
            Be the first to start a workout session!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {availableSessions.map(session => (
            <div
              key={session.id}
              style={{
                background: C.surface,
                borderRadius: 14,
                padding: '14px 16px',
                border: `1.5px solid ${C.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{session.hostName}'s Session</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                  {session.workoutType}
                </p>
              </div>
              <button
                onClick={() => handleJoinSession(session)}
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: F.body,
                }}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
