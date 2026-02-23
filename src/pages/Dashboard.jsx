import { useState, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import { supabase } from '../services/supabase';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import TeamSelector from '../components/dashboard/TeamSelector';
import TeamMembers from '../components/dashboard/TeamMembers';
import InviteSystem from '../components/dashboard/InviteSystem';
import TaskForm from '../components/tasks/TaskForm';

const Dashboard = () => {
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [latestSummary, setLatestSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      fetchDashboardData();
    }
  }, [currentTeam]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false });

      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: summaryData } = await supabase
        .from('ai_summaries')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setTasks(tasksData || []);
      setNotes(notesData || []);
      setLatestSummary(summaryData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, status: currentStatus } : t
        )
      );
      alert('Failed to update task status');
    }
  };

  const handleTaskFormClose = () => {
    setShowTaskModal(false);
    // Refresh tasks after closing modal (task might have been created/updated)
    fetchDashboardData();
  };

  if (!currentTeam) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#F5F5F4'
      }}>
        <div className="saas-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <img 
              src="/logo.png" 
              alt="SprintOS Logo" 
              style={{ 
                width: '64px', 
                height: '64px',
                objectFit: 'contain'
              }} 
            />
            <div style={{ fontSize: '64px' }}>🚀</div>
          </div>
          <h2 className="text-heading-xl" style={{ marginBottom: '12px' }}>
            Welcome to SprintOS
          </h2>
          <p className="text-body" style={{ marginBottom: '24px' }}>
            Create or select a team to begin your execution journey
          </p>
          <TeamSelector />
        </div>
      </div>
    );
  }

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.created_at).toDateString();
    return today === taskDate || task.status === 'in_progress';
  });

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  
  // Team execution metrics
  const tasksCompletedToday = tasks.filter(task => {
    const today = new Date().toDateString();
    const updatedDate = new Date(task.updated_at || task.created_at).toDateString();
    return task.status === 'completed' && today === updatedDate;
  }).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F4' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar onNewTask={() => setShowTaskModal(true)} />

        <main style={{ flex: 1, padding: '24px 32px 32px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px' 
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #E5E7EB',
                borderTop: '4px solid #F4C542',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <>
              {/* Team Execution Banner */}
              <div className="saas-card" style={{ 
                padding: '20px 24px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
                border: '1px solid #4ADE80'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#4ADE80',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '22px', height: '22px', color: '#FFFFFF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-heading-lg" style={{ marginBottom: '4px' }}>
                        Team Activity Today
                      </h3>
                      <p className="text-secondary" style={{ fontSize: '13px' }}>
                        Live collaboration metrics
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '32px',
                    alignItems: 'center'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: '700', 
                        color: '#16A34A',
                        marginBottom: '4px'
                      }}>
                        {tasksCompletedToday}
                      </div>
                      <span className="text-meta">Tasks Done</span>
                    </div>
                    
                    <div style={{ 
                      height: '40px', 
                      width: '1px', 
                      background: '#E5E7EB' 
                    }}></div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: '700', 
                        color: '#16A34A',
                        marginBottom: '4px'
                      }}>
                        3
                      </div>
                      <span className="text-meta">Active Members</span>
                    </div>
                    
                    <div style={{ 
                      height: '40px', 
                      width: '1px', 
                      background: '#E5E7EB' 
                    }}></div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: '700', 
                        color: '#16A34A',
                        marginBottom: '4px'
                      }}>
                        {inProgressTasks}
                      </div>
                      <span className="text-meta">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Total Tasks */}
                <div className="saas-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Total Tasks
                    </span>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933', marginBottom: '4px' }}>
                    {totalTasks}
                  </div>
                  <span className="text-meta">All tasks</span>
                </div>

                {/* Completed */}
                <div className="saas-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Completed
                    </span>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933', marginBottom: '4px' }}>
                    {completedTasks}
                  </div>
                  <span className="text-meta">{progressPercentage}% progress</span>
                </div>

                {/* In Progress */}
                <div className="saas-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                      In Progress
                    </span>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(244, 197, 66, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#F4C542' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933', marginBottom: '4px' }}>
                    {inProgressTasks}
                  </div>
                  <span className="text-meta">Active now</span>
                </div>

                {/* Pending */}
                <div className="saas-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Pending
                    </span>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(107, 114, 128, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933', marginBottom: '4px' }}>
                    {pendingTasks}
                  </div>
                  <span className="text-meta">Not started</span>
                </div>
              </div>

              {/* Main Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                {/* Today's Tasks */}
                <div className="saas-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 className="text-heading-lg">Today's Tasks</h3>
                    <button className="pill-button-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      View All
                    </button>
                  </div>

                  {todaysTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                      <p className="text-secondary">No tasks for today</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {todaysTasks.slice(0, 5).map((task) => (
                        <div 
                          key={task.id}
                          className="hover-overlay"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={task.status === 'completed'}
                            onChange={() => handleToggleTask(task.id, task.status)}
                            className="saas-checkbox"
                            style={{ flexShrink: 0, cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="text-label" style={{ fontSize: '14px', marginBottom: '4px' }}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-meta" style={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {task.description}
                              </p>
                            )}
                          </div>
                          <span className={`status-badge status-${task.status.replace('_', '-')}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Summary */}
                <div className="saas-card" style={{ 
                  padding: '24px',
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%)',
                  border: '2px solid #F4C542'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#F4C542',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '18px', height: '18px', color: '#1F2933' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-heading-lg">Latest AI Summary</h3>
                  </div>

                  {latestSummary ? (
                    <>
                      <p className="text-body" style={{ marginBottom: '16px', lineHeight: '1.7' }}>
                        {latestSummary.summary_text}
                      </p>
                      {latestSummary.action_items && latestSummary.action_items.length > 0 && (
                        <>
                          <div className="divider"></div>
                          <h4 className="text-label" style={{ fontSize: '14px', marginBottom: '12px' }}>
                            Action Items:
                          </h4>
                          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {latestSummary.action_items.map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                                <span style={{ color: '#F4C542', fontWeight: '700' }}>•</span>
                                <span className="text-body">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
                      <p className="text-secondary">No summaries generated yet</p>
                      <button className="pill-button" style={{ marginTop: '16px', fontSize: '13px', padding: '8px 16px' }}>
                        Generate Summary
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Collaboration Section */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <TeamMembers />
                <InviteSystem />
              </div>

              {/* Recent Activity / Notes */}
              <div className="saas-card" style={{ padding: '24px' }}>
                <h3 className="text-heading-lg" style={{ marginBottom: '20px' }}>Recent Notes</h3>
                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                    <p className="text-secondary">No notes yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {notes.map((note) => (
                      <div 
                        key={note.id}
                        style={{
                          padding: '16px',
                          background: '#FAFAF9',
                          borderRadius: '10px',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        <p className="text-body" style={{ 
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {note.content}
                        </p>
                        <span className="text-meta">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <TaskForm
          onClose={handleTaskFormClose}
          teamId={currentTeam.id}
        />
      )}
    </div>
  );
};

export default Dashboard;
