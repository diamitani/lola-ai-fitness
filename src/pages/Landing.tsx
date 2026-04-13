import { C, F, GS } from '../theme';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <style>{GS}</style>
      
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(253,248,245,0.97)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: F.display, fontSize: 28, color: C.rose, fontStyle: 'italic' }}>Lola</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.rose, background: C.roseLight, padding: '4px 10px', borderRadius: 20 }}>AI Fitness Coach</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: `2px solid ${C.border}`,
              background: 'transparent',
              color: C.text,
              fontFamily: F.body,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.rose}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: 'none',
              background: `linear-gradient(135deg, ${C.rose}, ${C.peach})`,
              color: '#fff',
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: `0 6px 20px rgba(232,130,106,0.3)`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🌸</div>
        <h1 style={{
          fontFamily: F.display,
          fontSize: 56,
          lineHeight: 1.1,
          marginBottom: 20,
          color: C.text,
        }}>
          Your personal <span style={{ color: C.rose }}>AI fitness coach</span> that actually gets you
        </h1>
        <p style={{
          fontSize: 20,
          color: C.muted,
          lineHeight: 1.6,
          marginBottom: 40,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Lola builds personalized workout plans, tracks your progress, and motivates you every step of the way. No guesswork, just results.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '18px 32px',
              borderRadius: 16,
              border: 'none',
              background: `linear-gradient(135deg, ${C.rose}, ${C.peach})`,
              color: '#fff',
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: `0 10px 30px rgba(232,130,106,0.4)`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Free Trial
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '18px 32px',
              borderRadius: 16,
              border: `2px solid ${C.border}`,
              background: 'transparent',
              color: C.text,
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.rose}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '80px 24px',
        background: C.cream,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: F.display,
            fontSize: 42,
            textAlign: 'center',
            marginBottom: 60,
            color: C.text,
          }}>
            Why thousands choose Lola
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 30,
          }}>
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Plans',
                desc: 'Workout plans tailored to your goals, equipment, and schedule by advanced AI.',
              },
              {
                icon: '📱',
                title: 'Always With You',
                desc: 'Chat with Lola anytime for form tips, nutrition advice, and motivation.',
              },
              {
                icon: '📊',
                title: 'Track Progress',
                desc: 'Visual dashboards show your streaks, PRs, and improvement over time.',
              },
              {
                icon: '🏋️‍♀️',
                title: 'Equipment-Aware',
                desc: 'Only suggests exercises you can do with what you have—home or gym.',
              },
              {
                icon: '👫',
                title: 'For Real People',
                desc: 'Built for busy schedules, injuries, beginners, and everyone in between.',
              },
              {
                icon: '🔒',
                title: 'Your Data, Private',
                desc: 'We never sell your data. Your journey is yours alone.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="fu"
                style={{
                  background: C.surface,
                  borderRadius: 20,
                  padding: '30px',
                  border: `1.5px solid ${C.border}`,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>{feat.icon}</div>
                <h3 style={{ fontFamily: F.display, fontSize: 22, marginBottom: 12, color: C.text }}>
                  {feat.title}
                </h3>
                <p style={{ color: C.muted, lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: F.display,
            fontSize: 42,
            textAlign: 'center',
            marginBottom: 60,
            color: C.text,
          }}>
            How Lola works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {[
              {
                step: '1',
                title: 'Tell Lola about you',
                desc: 'Share your goals, available equipment, workout frequency, and any injuries or preferences.',
                color: C.rose,
              },
              {
                step: '2',
                title: 'Get your personalized plan',
                desc: 'Lola generates a weekly workout schedule with exercises, sets, reps, and rest periods.',
                color: C.peach,
              },
              {
                step: '3',
                title: 'Follow along & track',
                desc: 'Check off exercises as you complete them, log your feelings, and watch your progress grow.',
                color: C.green,
              },
              {
                step: '4',
                title: 'Chat anytime',
                desc: 'Ask Lola questions about form, nutrition, motivation, or adjust your plan as life changes.',
                color: C.roseDark,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 40,
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.display,
                  fontSize: 32,
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: F.display, fontSize: 28, marginBottom: 12, color: C.text }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${C.dark}, #3D2518)`,
        color: '#fff',
        textAlign: 'center',
        borderRadius: '40px 40px 0 0',
        marginTop: 40,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: F.display, fontSize: 48, marginBottom: 20 }}>
            Ready to transform your fitness?
          </h2>
          <p style={{ fontSize: 20, color: '#ccc', marginBottom: 40, lineHeight: 1.6 }}>
            Join thousands who've found their perfect fitness partner in Lola. No credit card required to start.
          </p>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '20px 40px',
              borderRadius: 16,
              border: 'none',
              background: `linear-gradient(135deg, ${C.rose}, ${C.peach})`,
              color: '#fff',
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 20,
              cursor: 'pointer',
              boxShadow: `0 12px 40px rgba(232,130,106,0.5)`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Your Free Trial
          </button>
          <p style={{ fontSize: 14, color: '#999', marginTop: 30 }}>
            No credit card • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        background: C.dark,
        color: '#aaa',
        textAlign: 'center',
        borderTop: `1px solid rgba(255,255,255,0.1)`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
            <span style={{ fontFamily: F.display, fontSize: 28, color: C.peach, fontStyle: 'italic' }}>Lola</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.peach, background: 'rgba(245,196,176,0.2)', padding: '4px 10px', borderRadius: 20, marginLeft: 10 }}>
              AI Fitness Coach
            </span>
          </div>
          <p style={{ fontSize: 14, marginBottom: 20, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Lola is your personal AI fitness coach, helping you build sustainable habits and achieve your fitness goals with personalized guidance.
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>
            © {new Date().getFullYear()} Lola. Made with ❤️ for fitness enthusiasts everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}