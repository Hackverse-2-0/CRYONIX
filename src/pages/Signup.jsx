import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { data, error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Use replace to prevent back navigation to signup page
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      background: '#F5F5F4',
      position: 'relative'
    }}>
      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(244, 197, 66, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      <div className="saas-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '40px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <img 
              src="/logo.png" 
              alt="SprintOS Logo" 
              style={{ 
                width: '48px', 
                height: '48px',
                objectFit: 'contain'
              }} 
            />
            <div style={{ 
              fontSize: '48px', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #F4C542 0%, #E6B800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SprintOS
            </div>
          </div>
          <p className="text-secondary">Create your team execution workspace</p>
        </div>

        {error && (
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px'
          }}>
            <p style={{ color: '#EF4444', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="saas-input"
              placeholder="John Doe"
              style={{ fontSize: '14px' }}
            />
          </div>

          <div>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="saas-input"
              placeholder="you@company.com"
              style={{ fontSize: '14px' }}
            />
          </div>

          <div>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="saas-input"
              placeholder="••••••••"
              style={{ fontSize: '14px' }}
            />
          </div>

          <div>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="saas-input"
              placeholder="••••••••"
              style={{ fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pill-button"
            style={{ 
              width: '100%',
              marginTop: '8px',
              justifyContent: 'center',
              padding: '12px 20px',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #1F2933',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Creating account...
              </span>
            ) : (
              <>
                Create Account
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="text-body">
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#F4C542', 
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          </p>
        </div>

        <div style={{ 
          marginTop: '32px', 
          paddingTop: '24px', 
          borderTop: '1px solid #E5E7EB' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              background: '#10B981', 
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            <span className="text-meta">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
