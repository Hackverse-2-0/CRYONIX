import { useState } from 'react';
import { useTeam } from '../../context/TeamContext';

const TeamSelector = () => {
  const { currentTeam, teams, switchTeam, createTeam } = useTeam();
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    if (!teamName.trim() || !projectName.trim()) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createTeam(teamName.trim(), projectName.trim());

    if (result.error) {
      setError(result.error.message || 'Failed to create team');
      setLoading(false);
    } else {
      setShowModal(false);
      setTeamName('');
      setProjectName('');
      setLoading(false);
      // Team will auto-switch in context
    }
  };

  const handleSelectTeam = (team) => {
    switchTeam(team);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Show Team Grid if teams exist */}
      {teams.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="text-heading-lg" style={{ marginBottom: '16px', textAlign: 'center' }}>
            Your Teams
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="saas-card hover-overlay"
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: currentTeam?.id === team.id ? '2px solid #F4C542' : '1px solid rgba(0, 0, 0, 0.04)',
                  background: currentTeam?.id === team.id ? '#FFF9E6' : '#FFFFFF'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: currentTeam?.id === team.id ? '#F4C542' : '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: currentTeam?.id === team.id ? '#1F2933' : '#6B7280'
                }}>
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-label" style={{ 
                  fontSize: '16px', 
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {team.name}
                </div>
                <div className="text-meta" style={{ 
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {team.project_name}
                </div>
                {currentTeam?.id === team.id && (
                  <div style={{ 
                    marginTop: '12px',
                    color: '#F4C542',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ✓ Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create New Team Button */}
      <button
        onClick={() => setShowModal(true)}
        className="pill-button"
        style={{ 
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          justifyContent: 'center'
        }}
      >
        <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {teams.length > 0 ? 'Create Another Team' : 'Create Your First Team'}
      </button>

      {/* Create Team Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="saas-card" style={{ 
            width: '100%', 
            maxWidth: '480px', 
            padding: '32px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 className="text-heading-xl">Create New Team</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setTeamName('');
                  setProjectName('');
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateTeam}>
              <div style={{ marginBottom: '20px' }}>
                <label className="text-label" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#1F2933'
                }}>
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Frontend Squad"
                  className="saas-input"
                  autoFocus
                  required
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label className="text-label" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#1F2933'
                }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., E-commerce Platform"
                  className="saas-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setTeamName('');
                    setProjectName('');
                  }}
                  className="pill-button-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="pill-button"
                  style={{ 
                    flex: 1,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #1F2933',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create Team
                    </>
                  )}
                </button>
              </div>
            </form>

            <div style={{ 
              marginTop: '24px', 
              paddingTop: '24px', 
              borderTop: '1px solid #E5E7EB'
            }}>
              <p className="text-meta" style={{ textAlign: 'center' }}>
                Teams are shared workspaces for collaboration
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
