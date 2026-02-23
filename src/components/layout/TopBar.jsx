import { useState } from 'react';
import { useTeam } from '../../context/TeamContext';

const TopBar = ({ onNewTask }) => {
  const { currentTeam, teams, switchTeam, createTeam } = useTeam();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newProjectName.trim()) {
      alert('Please enter both team name and project name');
      return;
    }

    const { data, error } = await createTeam(newTeamName, newProjectName);
    
    if (error) {
      alert('Failed to create team: ' + error.message);
    } else {
      setShowCreateModal(false);
      setNewTeamName('');
      setNewProjectName('');
      alert('✅ Team created successfully!');
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '72px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          gap: '24px'
        }}
      >
        {/* Team Selector Dropdown */}
        <div style={{ minWidth: '240px', position: 'relative' }}>
          <button
            onClick={() => setShowTeamDropdown(!showTeamDropdown)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: '#FAFAF9',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#F5F5F4';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FAFAF9';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div className="text-label" style={{ fontSize: '14px', marginBottom: '2px' }}>
                {currentTeam?.name || 'Select a Team'}
              </div>
              <div className="text-meta" style={{ fontSize: '11px' }}>
                {currentTeam?.project_name || 'No project selected'}
              </div>
            </div>
            <svg style={{ width: '16px', height: '16px', color: '#6B7280', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showTeamDropdown && (
            <>
              {/* Backdrop */}
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 49
                }}
                onClick={() => setShowTeamDropdown(false)}
              />
              
              {/* Dropdown Content */}
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  zIndex: 50,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {/* Team List */}
                <div style={{ padding: '8px' }}>
                  {teams.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center' }}>
                      <p className="text-secondary" style={{ fontSize: '13px' }}>No teams yet</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => {
                          switchTeam(team);
                          setShowTeamDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          background: currentTeam?.id === team.id ? '#FFF9E6' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                          marginBottom: '4px'
                        }}
                        onMouseOver={(e) => {
                          if (currentTeam?.id !== team.id) {
                            e.currentTarget.style.background = '#F5F5F4';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentTeam?.id !== team.id) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: currentTeam?.id === team.id ? '#F4C542' : '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '14px',
                          fontWeight: '700',
                          color: currentTeam?.id === team.id ? '#1F2933' : '#6B7280'
                        }}>
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: '#1F2933',
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
                        </div>
                        {currentTeam?.id === team.id && (
                          <svg style={{ width: '16px', height: '16px', color: '#F4C542', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Create New Team Button */}
                <div style={{ 
                  borderTop: '1px solid #E5E7EB', 
                  padding: '8px'
                }}>
                  <button
                    onClick={() => {
                      setShowTeamDropdown(false);
                      setShowCreateModal(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#FFF9E6';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#F4C542',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg style={{ width: '18px', height: '18px', color: '#1F2933' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#1F2933'
                    }}>
                      Create New Team
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <svg 
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#9CA3AF'
            }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks, notes, or team members..."
            className="saas-input search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* New Task Button */}
        <button 
          className="pill-button"
          onClick={onNewTask}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>

        {/* Settings Icon */}
        <button
          className="pill-button-secondary"
          onClick={() => setShowSettingsModal(true)}
          style={{
            width: '40px',
            height: '40px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
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
          zIndex: 100
        }}>
          <div className="saas-card" style={{ 
            width: '100%', 
            maxWidth: '480px', 
            padding: '32px'
          }}>
            <h2 className="text-heading-xl" style={{ marginBottom: '24px' }}>Create New Team</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Team Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Frontend Squad"
                className="saas-input"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g., E-commerce Platform"
                className="saas-input"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="pill-button-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTeamName('');
                  setNewProjectName('');
                }}
              >
                Cancel
              </button>
              <button
                className="pill-button"
                onClick={handleCreateTeam}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
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
              <h2 className="text-heading-xl">Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
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

            <div style={{ marginBottom: '20px' }}>
              <h3 className="text-label" style={{ marginBottom: '12px' }}>Account</h3>
              <p className="text-secondary">Manage your account settings and preferences</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 className="text-label" style={{ marginBottom: '12px' }}>Team</h3>
              <p className="text-secondary">View and manage team members</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 className="text-label" style={{ marginBottom: '12px' }}>Notifications</h3>
              <p className="text-secondary">Configure notification preferences</p>
            </div>

            <div style={{ 
              marginTop: '24px', 
              paddingTop: '24px', 
              borderTop: '1px solid #E5E7EB'
            }}>
              <button
                className="pill-button-secondary"
                style={{ width: '100%' }}
                onClick={() => setShowSettingsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
