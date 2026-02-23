import { useState, useEffect } from 'react';
import { useTeam } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

const InviteSystem = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (currentTeam && user) {
      checkIfOrganizer();
      loadInviteCode();
    }
  }, [currentTeam, user]);

  const checkIfOrganizer = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', currentTeam.id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      setIsOrganizer(data?.role === 'organizer');
    } catch (error) {
      console.error('Error checking role:', error);
      setIsOrganizer(false);
    }
  };

  const loadInviteCode = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('invite_code')
        .eq('id', currentTeam.id)
        .single();

      if (error) throw error;
      setInviteCode(data?.invite_code || '');
    } catch (error) {
      console.error('Error loading invite code:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = async () => {
    if (!isOrganizer) {
      alert('Only organizers can regenerate invite codes');
      return;
    }

    setGenerating(true);
    
    try {
      const { data, error } = await supabase
        .rpc('regenerate_invite_code', { p_team_id: currentTeam.id });

      if (error) throw error;
      setInviteCode(data);
      alert('✅ New invite code generated!');
    } catch (error) {
      console.error('Error regenerating code:', error);
      alert('❌ Failed to regenerate code: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      alert('Please enter an invite code');
      return;
    }

    setJoining(true);

    try {
      const { data, error } = await supabase
        .rpc('join_team_via_invite', { p_invite_code: joinCode.toUpperCase().trim() });

      if (error) throw error;
      alert(`✅ Successfully joined team: ${data[0].team_name}`);
      setJoinCode('');
      window.location.reload(); // Reload to update team list
    } catch (error) {
      console.error('Error joining team:', error);
      alert('❌ ' + error.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="saas-card" style={{ padding: '24px' }}>
      <h3 className="text-heading-lg" style={{ marginBottom: '20px' }}>
        {isOrganizer ? 'Invite Members' : 'Join Team'}
      </h3>

      {isOrganizer ? (
        /* Organizer Panel */
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px' 
            }}>
              Team Invite Code
            </label>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{
                flex: 1,
                padding: '16px',
                background: '#FFF9E6',
                border: '2px solid #F4C542',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  color: '#E6B800',
                  fontFamily: 'monospace'
                }}>
                  {inviteCode}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCopyCode}
              className="pill-button"
              style={{ flex: 1 }}
            >
              {copied ? (
                <>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
            <button
              onClick={handleRegenerateCode}
              disabled={generating}
              className="pill-button-secondary"
              style={{ 
                flex: 1,
                opacity: generating ? 0.5 : 1,
                cursor: generating ? 'not-allowed' : 'pointer'
              }}
            >
              {generating ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #6B7280',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </>
              )}
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#F0FDF4',
            border: '1px solid #4ADE80',
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '13px', color: '#16A34A', marginBottom: '6px', fontWeight: '600' }}>
              💡 How it works
            </p>
            <p style={{ fontSize: '12px', color: '#16A34A', lineHeight: '1.6' }}>
              Share this code with team members. They can join by entering it below. Codes are unique and can be regenerated for security.
            </p>
          </div>
        </div>
      ) : (
        /* Member Join Panel */
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label className="text-label" style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px' 
            }}>
              Enter Invite Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="SPRT-XXXXX"
              className="saas-input"
              style={{ 
                textAlign: 'center',
                letterSpacing: '2px',
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: '600'
              }}
            />
          </div>

          <button
            onClick={handleJoinTeam}
            disabled={joining}
            className="pill-button"
            style={{ 
              width: '100%',
              opacity: joining ? 0.5 : 1,
              cursor: joining ? 'not-allowed' : 'pointer'
            }}
          >
            {joining ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #1F2933',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Joining...
              </>
            ) : (
              <>
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Join Team
              </>
            )}
          </button>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#EEF2FF',
            border: '1px solid #818CF8',
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '13px', color: '#6366F1', marginBottom: '6px', fontWeight: '600' }}>
              ℹ️ Need an invite?
            </p>
            <p style={{ fontSize: '12px', color: '#6366F1', lineHeight: '1.6' }}>
              Ask your team organizer for the invite code. Once joined, you'll have access to all team tasks and notes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteSystem;
