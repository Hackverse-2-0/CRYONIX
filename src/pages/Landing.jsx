import { Link } from 'react-router-dom';
import { useState } from 'react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ 
      background: '#F5F5F4',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle background gradient blobs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(244, 197, 66, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img 
              src="/logo.png" 
              alt="SprintOS Logo" 
              style={{ 
                width: '36px', 
                height: '36px',
                objectFit: 'contain'
              }} 
            />
            <span style={{ 
              fontSize: '22px', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #F4C542 0%, #E6B800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SprintOS
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <a href="#features" style={{ 
              fontSize: '15px',
              color: '#1F2933',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Features
            </a>
            <a href="#how-it-works" style={{ 
              fontSize: '15px',
              color: '#1F2933',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              How It Works
            </a>
            <a href="#contact" style={{ 
              fontSize: '15px',
              color: '#1F2933',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Link 
              to="/login"
              className="pill-button-secondary"
              style={{ padding: '10px 24px' }}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="pill-button"
              style={{ padding: '10px 24px' }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left: Hero Text */}
        <div>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            lineHeight: '1.1',
            color: '#1F2933',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            Turn Team Chaos into{' '}
            <span style={{
              background: 'linear-gradient(135deg, #F4C542 0%, #E6B800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Clear Execution
            </span>
          </h1>
          
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#6B7280',
            marginBottom: '32px',
            maxWidth: '540px'
          }}>
            Stop losing tasks in group chats. SprintOS organizes your team with smart task management, 
            member roles, and instant invite-code collaboration—built for hackathons and fast-moving projects.
          </p>

          <div style={{ 
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <Link 
              to="/signup"
              className="pill-button"
              style={{ 
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Sign Up Free
            </Link>
            <Link 
              to="/login"
              className="pill-button-secondary"
              style={{ 
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Login
            </Link>
          </div>

          <div style={{
            marginTop: '40px',
            display: 'flex',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2933' }}>500+</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Teams Using</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }}></div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2933' }}>10k+</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Tasks Completed</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }}></div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2933' }}>4.9★</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>User Rating</div>
            </div>
          </div>
        </div>

        {/* Right: Dashboard Preview */}
        <div style={{ position: 'relative' }}>
          <div className="saas-card" style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)'
          }}>
            {/* Mock dashboard header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #F4C542 0%, #E6B800 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                🚀
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2933' }}>Team Alpha</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>3 members online</div>
              </div>
            </div>

            {/* Mock tasks */}
            {[
              { title: 'Design landing page', status: 'In Progress', color: '#3B82F6' },
              { title: 'Setup authentication', status: 'Completed', color: '#10B981' },
              { title: 'Database integration', status: 'Pending', color: '#F59E0B' }
            ].map((task, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: '#F9FAFB',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: task.color
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1F2933' }}>{task.title}</div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: task.color + '20',
                  color: task.color,
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {task.status}
                </div>
              </div>
            ))}

            {/* Mock progress bar */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Team Progress</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#F4C542' }}>67%</span>
              </div>
              <div style={{
                height: '8px',
                background: '#E5E7EB',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '67%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #F4C542 0%, #E6B800 100%)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '16px'
          }}>
            Stop Fighting These Problems
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
            Every team hits these roadblocks. SprintOS eliminates them.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {[
            {
              icon: '💬',
              title: 'Tasks Lost in Chats',
              desc: 'Important work drowns in group messages'
            },
            {
              icon: '❓',
              title: 'No Clear Work Division',
              desc: 'Who\'s doing what? Nobody knows.'
            },
            {
              icon: '📝',
              title: 'Meetings Without Action',
              desc: 'Great ideas, zero follow-through'
            }
          ].map((problem, idx) => (
            <div key={idx} className="saas-card" style={{
              padding: '32px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{problem.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2933', marginBottom: '8px' }}>
                {problem.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                {problem.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(244, 197, 66, 0.1) 0%, rgba(230, 184, 0, 0.05) 100%)',
          borderRadius: '16px',
          border: '2px solid #F4C542'
        }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#1F2933' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>✨</span>
            SprintOS transforms scattered work into organized execution with roles, tracking, and instant collaboration.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '16px'
          }}>
            Everything Your Team Needs
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>
            Built for speed, designed for clarity
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {[
            {
              icon: '👥',
              title: 'Team Members & Roles',
              desc: 'See who\'s online, assign roles (Frontend, Backend, AI, Design), and know who does what.',
              color: '#3B82F6'
            },
            {
              icon: '🔑',
              title: 'Join via Invite Code',
              desc: 'Share a simple SPRT-XXXXX code. New members join instantly—no emails, no friction.',
              color: '#10B981'
            },
            {
              icon: '📊',
              title: 'Work Distribution Analytics',
              desc: 'Track tasks completed, members active, and progress percentage in real time.',
              color: '#8B5CF6'
            },
            {
              icon: '🤖',
              title: 'AI Summary Panel',
              desc: 'Paste meeting notes. Get instant summaries and action items automatically extracted.',
              color: '#F59E0B'
            }
          ].map((feature, idx) => (
            <div key={idx} className="saas-card" style={{
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: feature.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '20px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2933',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                lineHeight: '1.6'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '16px'
          }}>
            How It Works
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>
            Get your team organized in 3 simple steps
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px',
          position: 'relative'
        }}>
          {[
            {
              step: '1',
              title: 'Create or Join Team',
              desc: 'Start a new team or join one using an invite code. Takes 30 seconds.',
              icon: '🚀'
            },
            {
              step: '2',
              title: 'Assign Roles & Divide Work',
              desc: 'Give everyone a role. Create tasks. Everyone knows their responsibilities.',
              icon: '🎯'
            },
            {
              step: '3',
              title: 'Track Execution in Real Time',
              desc: 'See progress, online members, and completed tasks. Stay synced without meetings.',
              icon: '📈'
            }
          ].map((step, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div className="saas-card" style={{
                padding: '32px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F4C542 0%, #E6B800 100%)',
                  color: '#1F2933',
                  fontSize: '20px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #F5F5F4'
                }}>
                  {step.step}
                </div>
                <div style={{ fontSize: '48px', marginTop: '20px', marginBottom: '16px' }}>
                  {step.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2933',
                  marginBottom: '12px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.6'
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 24px 120px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="saas-card" style={{
          padding: '56px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #F4C542'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Ready to Organize Your Team's Workflow?
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6B7280',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Join hundreds of teams using SprintOS to execute faster and smarter.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link 
              to="/signup"
              className="pill-button"
              style={{ 
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Team
            </Link>
            <Link 
              to="/login"
              className="pill-button-secondary"
              style={{ 
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Login
            </Link>
          </div>
          <p style={{
            marginTop: '24px',
            fontSize: '13px',
            color: '#9CA3AF'
          }}>
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{
        borderTop: '1px solid #E5E7EB',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        padding: '48px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px'
        }}>
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <img 
                src="/logo.png" 
                alt="SprintOS Logo" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  objectFit: 'contain'
                }} 
              />
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1F2933'
              }}>
                SprintOS
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Team execution platform built for hackathons and fast-moving projects.
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
              © 2026 SprintOS. All rights reserved.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1F2933', marginBottom: '16px' }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#features" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Features</a>
              <a href="#how-it-works" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>How It Works</a>
              <Link to="/login" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1F2933', marginBottom: '16px' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Help Center</a>
              <a href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Documentation</a>
              <a href="#contact" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>Contact Us</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1F2933', marginBottom: '16px' }}>
              Connect
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>
                🐦
              </a>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>
                💼
              </a>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>
                📧
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
