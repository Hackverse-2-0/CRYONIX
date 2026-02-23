import { useState, useEffect } from 'react';
import { useTeam } from '../../context/TeamContext';
import { supabase } from '../../services/supabase';

const TeamMembers = () => {
  const { currentTeam } = useTeam();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers();
    }
  }, [currentTeam]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          user_id,
          joined_at,
          users (
            id,
            email,
            name,
            user_metadata
          )
        `)
        .eq('team_id', currentTeam.id);

      if (error) throw error;

      // Add demo members for showcase
      const realMembers = data.map((item, index) => ({
        id: item.user_id,
        name: item.users?.name || item.users?.email?.split('@')[0] || 'User',
        email: item.users?.email,
        role: index === 0 ? 'Organizer' : ['Frontend', 'Backend', 'AI', 'Design'][index % 4],
        isOnline: index === 0, // First member (current user) is online
        avatar: item.users?.email?.charAt(0).toUpperCase() || 'U',
        tasksToday: Math.floor(Math.random() * 8) + 1
      }));

      // Add placeholder members for demo
      const placeholderMembers = [
        { id: 'demo-1', name: 'Sarah Chen', email: 'sarah@team.com', role: 'Frontend', isOnline: true, avatar: 'S', tasksToday: 5 },
        { id: 'demo-2', name: 'Alex Kumar', email: 'alex@team.com', role: 'Backend', isOnline: false, avatar: 'A', tasksToday: 3 },
        { id: 'demo-3', name: 'Jordan Lee', email: 'jordan@team.com', role: 'AI', isOnline: true, avatar: 'J', tasksToday: 4 }
      ];

      const allMembers = [...realMembers, ...placeholderMembers].slice(0, 6);
      setMembers(allMembers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Organizer': { bg: '#FFF9E6', text: '#E6B800', border: '#F4C542' },
      'Frontend': { bg: '#EEF2FF', text: '#6366F1', border: '#818CF8' },
      'Backend': { bg: '#FEF2F2', text: '#DC2626', border: '#F87171' },
      'AI': { bg: '#F0FDF4', text: '#16A34A', border: '#4ADE80' },
      'Design': { bg: '#FDF4FF', text: '#C026D3', border: '#E879F9' }
    };
    return colors[role] || colors['Frontend'];
  };

  if (loading) {
    return (
      <div className="saas-card" style={{ padding: '24px', minHeight: '200px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '150px' 
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #E5E7EB',
            borderTop: '3px solid #F4C542',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  const activeToday = members.filter(m => m.isOnline).length;
  const totalTasksToday = members.reduce((sum, m) => sum + m.tasksToday, 0);

  return (
    <div className="saas-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 className="text-heading-lg">Team Members</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            padding: '4px 12px',
            background: '#FFF9E6',
            border: '1px solid #F4C542',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#E6B800'
          }}>
            {activeToday} Active
          </div>
          <div style={{
            padding: '4px 12px',
            background: '#F0FDF4',
            border: '1px solid #4ADE80',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#16A34A'
          }}>
            {totalTasksToday} Done Today
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px'
      }}>
        {members.map((member) => {
          const roleColors = getRoleBadgeColor(member.role);
          return (
            <div 
              key={member.id}
              className="hover-overlay"
              style={{
                padding: '16px',
                background: '#FAFAF9',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Online Indicator */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: member.isOnline ? '#10B981' : '#9CA3AF',
                border: '2px solid #FFFFFF'
              }}></div>

              {/* Avatar */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: member.isOnline ? '#F4C542' : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '20px',
                fontWeight: '700',
                color: member.isOnline ? '#1F2933' : '#6B7280'
              }}>
                {member.avatar}
              </div>

              {/* Name */}
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2933',
                marginBottom: '6px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {member.name}
              </div>

              {/* Role Badge */}
              <div style={{
                padding: '3px 10px',
                background: roleColors.bg,
                border: `1px solid ${roleColors.border}`,
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '600',
                color: roleColors.text,
                display: 'inline-block',
                marginBottom: '8px'
              }}>
                {member.role}
              </div>

              {/* Tasks Today */}
              <div style={{
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px'
              }}>
                {member.tasksToday} tasks today
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamMembers;
