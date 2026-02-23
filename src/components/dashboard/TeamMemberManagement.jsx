import { useState, useEffect } from 'react';
import { useTeam } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

const TeamMemberManagement = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTeam && user) {
      fetchMembers();
    }
  }, [currentTeam, user]);

  const fetchMembers = async () => {
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
        .order('role', { ascending: true });

      if (error) throw error;

      const formattedMembers = data.map(member => ({
        id: member.user_id,
        name: member.users?.name || member.users?.email?.split('@')[0] || 'User',
        email: member.users?.email,
        role: member.role,
        isCurrentUser: member.user_id === user.id,
        avatar: (member.users?.name || member.users?.email)?.charAt(0).toUpperCase() || 'U'
      }));

      setMembers(formattedMembers);

      // Check if current user is organizer
      const currentUserMember = formattedMembers.find(m => m.isCurrentUser);
      setIsOrganizer(currentUserMember?.role === 'organizer');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!isOrganizer) {
      alert('Only organizers can change member roles');
      return;
    }

    if (memberId === user.id && newRole !== 'organizer') {
      if (!confirm('Are you sure you want to remove yourself as organizer? This action might prevent you from managing the team.')) {
        return;
      }
    }

    try {
      const { error } = await supabase
        .rpc('update_member_role', {
          p_team_id: currentTeam.id,
          p_member_id: memberId,
          p_new_role: newRole
        });

      if (error) throw error;

      alert('✅ Member role updated successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('❌ ' + error.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      organizer: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
      frontend: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
      backend: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
      ai: { bg: '#E9D5FF', text: '#6B21A8', border: '#A855F7' },
      design: { bg: '#FCE7F3', text: '#9F1239', border: '#EC4899' },
      member: { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' }
    };
    return colors[role] || colors.member;
  };

  const getAvatarColor = (letter) => {
    const colors = {
      'A': '#3B82F6', 'B': '#8B5CF6', 'C': '#EC4899', 'D': '#F59E0B',
      'E': '#10B981', 'F': '#6366F1', 'G': '#14B8A6', 'H': '#F43F5E',
      'I': '#A855F7', 'J': '#06B6D4', 'K': '#84CC16', 'L': '#EAB308',
      'M': '#F97316', 'N': '#22C55E', 'O': '#0EA5E9', 'P': '#C026D3',
      'Q': '#DC2626', 'R': '#4F46E5', 'S': '#F59E0B', 'T': '#8B5CF6',
      'U': '#10B981', 'V': '#3B82F6', 'W': '#F43F5E', 'X': '#14B8A6',
      'Y': '#F59E0B', 'Z': '#6366F1'
    };
    return colors[letter?.toUpperCase()] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="saas-card" style={{ padding: '24px', textAlign: 'center' }}>
        <p className="text-secondary">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="saas-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 className="text-heading-lg" style={{ marginBottom: '8px' }}>
          Team Members ({members.length})
        </h3>
        <p className="text-secondary" style={{ fontSize: '13px' }}>
          {isOrganizer ? 'Manage roles and permissions' : 'View team members and roles'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {members.map((member) => {
          const roleColors = getRoleBadgeColor(member.role);
          
          return (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: member.isCurrentUser ? 'rgba(244, 197, 66, 0.05)' : '#FFFFFF'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: getAvatarColor(member.avatar),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                color: '#FFFFFF',
                flexShrink: 0
              }}>
                {member.avatar}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <p className="text-label" style={{ fontSize: '15px' }}>
                    {member.name}
                    {member.isCurrentUser && (
                      <span style={{ 
                        marginLeft: '6px', 
                        fontSize: '12px', 
                        color: '#F4C542',
                        fontWeight: '600'
                      }}>
                        (You)
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-secondary" style={{ fontSize: '13px' }}>
                  {member.email}
                </p>
              </div>

              {isOrganizer ? (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className="saas-input"
                  style={{
                    width: 'auto',
                    minWidth: '140px',
                    fontSize: '13px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="organizer">👑 Organizer</option>
                  <option value="frontend">💻 Frontend</option>
                  <option value="backend">⚙️ Backend</option>
                  <option value="ai">🤖 AI</option>
                  <option value="design">🎨 Design</option>
                  <option value="member">👤 Member</option>
                </select>
              ) : (
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: roleColors.bg,
                  border: `1px solid ${roleColors.border}`,
                  color: roleColors.text,
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}>
                  {member.role === 'organizer' && '👑 '}
                  {member.role === 'frontend' && '💻 '}
                  {member.role === 'backend' && '⚙️ '}
                  {member.role === 'ai' && '🤖 '}
                  {member.role === 'design' && '🎨 '}
                  {member.role}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isOrganizer && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#EEF2FF',
          border: '1px solid #C7D2FE',
          borderRadius: '10px'
        }}>
          <p style={{ fontSize: '12px', color: '#4F46E5', lineHeight: '1.6' }}>
            💡 <strong>Tip:</strong> Assign roles to help organize your team. Organizers can manage members and settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamMemberManagement;
