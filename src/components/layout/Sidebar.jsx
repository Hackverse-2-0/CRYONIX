import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { currentTeam } = useTeam();
  const [onlineMembers, setOnlineMembers] = useState([]);

  const navigation = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Tasks', 
      path: '/tasks', 
      icon: (
        <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      name: 'Notes', 
      path: '/notes',
      badge: 'AI',
      icon: (
        <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: (
        <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (currentTeam) {
      fetchOnlineMembers();
      // Update last_seen every 30 seconds
      const interval = setInterval(() => {
        updateLastSeen();
      }, 30000);
      
      // Initial update
      updateLastSeen();
      
      return () => clearInterval(interval);
    }
  }, [currentTeam]);

  const updateLastSeen = async () => {
    if (!currentTeam) return;
    try {
      await supabase.rpc('update_last_seen', { p_team_id: currentTeam.id });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  };

  const fetchOnlineMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          user_id,
          role,
          last_seen,
          users (
            id,
            email,
            name
          )
        `)
        .eq('team_id', currentTeam.id)
        .order('last_seen', { ascending: false });

      if (error) throw error;

      // Consider online if last_seen within 2 minutes
      const now = new Date();
      const onlineThreshold = 2 * 60 * 1000; // 2 minutes in milliseconds

      const membersWithStatus = data.map(member => ({
        id: member.user_id,
        name: member.users?.name || member.users?.email?.split('@')[0] || 'User',
        email: member.users?.email,
        role: member.role,
        isOnline: member.last_seen && (now - new Date(member.last_seen) < onlineThreshold),
        avatar: (member.users?.name || member.users?.email)?.charAt(0).toUpperCase() || 'U'
      }));

      setOnlineMembers(membersWithStatus);
    } catch (error) {
      console.error('Error fetching online members:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div 
      style={{ 
        height: '100vh',
        width: '240px',
        background: '#FAFAF9',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflowY: 'auto'
      }}
    >
      {/* Logo */}
      <div style={{ 
        padding: '24px 20px', 
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
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
        <h1 className="logo-text">SprintOS</h1>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.badge && (
              <span style={{
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: '700',
                background: '#F4C542',
                color: '#1F2933'
              }}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Online Team Members Section */}
      {currentTeam && onlineMembers.length > 0 && (
        <div style={{ 
          padding: '16px 12px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 4px'
          }}>
            <span className="text-meta" style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Team Members
            </span>
            <span style={{
              padding: '2px 6px',
              borderRadius: '9999px',
              background: '#10B981',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: '700'
            }}>
              {onlineMembers.filter(m => m.isOnline).length}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {onlineMembers.slice(0, 8).map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '6px',
                  background: member.isOnline ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getAvatarColor(member.avatar)} 0%, ${getAvatarColor(member.avatar, true)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}>
                    {member.avatar}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: member.isOnline ? '#10B981' : '#9CA3AF',
                    border: '2px solid #FAFAF9'
                  }}></div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#1F2933',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.3'
                  }}>
                    {member.name}
                  </p>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#9CA3AF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize'
                  }}>
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#F4C542',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px',
            color: '#1F2933'
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1F2933',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.user_metadata?.name || 'User'}
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: '#9CA3AF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#FEF2F2';
            e.currentTarget.style.borderColor = '#FCA5A5';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Generate consistent avatar colors based on first letter
const getAvatarColor = (letter, darker = false) => {
  const colors = {
    'A': ['#3B82F6', '#2563EB'], 'B': ['#8B5CF6', '#7C3AED'], 
    'C': ['#EC4899', '#DB2777'], 'D': ['#F59E0B', '#D97706'],
    'E': ['#10B981', '#059669'], 'F': ['#6366F1', '#4F46E5'],
    'G': ['#14B8A6', '#0D9488'], 'H': ['#F43F5E', '#E11D48'],
    'I': ['#A855F7', '#9333EA'], 'J': ['#06B6D4', '#0891B2'],
    'K': ['#84CC16', '#65A30D'], 'L': ['#EAB308', '#CA8A04'],
    'M': ['#F97316', '#EA580C'], 'N': ['#22C55E', '#16A34A'],
    'O': ['#0EA5E9', '#0284C7'], 'P': ['#C026D3', '#A21CAF'],
    'Q': ['#DC2626', '#B91C1C'], 'R': ['#4F46E5', '#4338CA'],
    'S': ['#F59E0B', '#D97706'], 'T': ['#8B5CF6', '#7C3AED'],
    'U': ['#10B981', '#059669'], 'V': ['#3B82F6', '#2563EB'],
    'W': ['#F43F5E', '#E11D48'], 'X': ['#14B8A6', '#0D9488'],
    'Y': ['#F59E0B', '#D97706'], 'Z': ['#6366F1', '#4F46E5']
  };
  const colorPair = colors[letter?.toUpperCase()] || ['#6B7280', '#4B5563'];
  return darker ? colorPair[1] : colorPair[0];
};

export default Sidebar;
