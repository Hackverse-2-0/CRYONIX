import { useState, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import { supabase } from '../services/supabase';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTeam) {
      fetchTasks();
    }
  }, [currentTeam]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, assigned_to_user:users(name, email)')
        .eq('team_id', currentTeam.id);

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [completedTasks, inProgressTasks, pendingTasks],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(244, 197, 66, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(244, 197, 66, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const memberTaskCounts = {};
  tasks.forEach(task => {
    if (task.assigned_to_user) {
      const memberName = task.assigned_to_user.name || task.assigned_to_user.email;
      memberTaskCounts[memberName] = (memberTaskCounts[memberName] || 0) + 1;
    } else {
      memberTaskCounts['Unassigned'] = (memberTaskCounts['Unassigned'] || 0) + 1;
    }
  });

  const memberChartData = {
    labels: Object.keys(memberTaskCounts),
    datasets: [
      {
        label: 'Tasks per Member',
        data: Object.values(memberTaskCounts),
        backgroundColor: 'rgba(244, 197, 66, 0.8)',
        borderColor: 'rgba(244, 197, 66, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          padding: 12,
          color: '#1F2933'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2933',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          padding: 12,
          color: '#1F2933',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2933',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    }
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
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📊</div>
          <h2 className="text-heading-xl" style={{ marginBottom: '12px' }}>
            No Team Selected
          </h2>
          <p className="text-body">
            Please select a team from the dashboard to view analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F4' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        
        <main style={{ 
          flex: 1, 
          padding: '24px 32px 32px 32px',
          overflowY: 'auto'
        }}>
          {/* Page Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 className="text-heading-xl" style={{ marginBottom: '8px' }}>
              Team Analytics
            </h1>
            <p className="text-secondary">
              Track your team's progress and performance metrics
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                border: '4px solid #E5E7EB',
                borderTop: '4px solid #F4C542',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p className="text-secondary">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div className="saas-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: '500' }}>
                    Total Tasks
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933' }}>
                    {totalTasks}
                  </div>
                </div>

                <div className="saas-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: '500' }}>
                    Completed
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>
                    {completedTasks}
                  </div>
                </div>

                <div className="saas-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: '500' }}>
                    In Progress
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F4C542' }}>
                    {inProgressTasks}
                  </div>
                </div>

                <div className="saas-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: '500' }}>
                    Completion Rate
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2933' }}>
                    {completionRate}%
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {/* Status Distribution */}
                <div className="saas-card" style={{ padding: '24px' }}>
                  <h3 className="text-heading-lg" style={{ marginBottom: '20px' }}>
                    Task Status Distribution
                  </h3>
                  <div style={{ padding: '20px 0' }}>
                    <Doughnut data={statusChartData} options={doughnutOptions} />
                  </div>
                </div>

                {/* Member Distribution */}
                <div className="saas-card" style={{ padding: '24px' }}>
                  <h3 className="text-heading-lg" style={{ marginBottom: '20px' }}>
                    Tasks per Team Member
                  </h3>
                  <div style={{ padding: '20px 0' }}>
                    <Bar data={memberChartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="saas-card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 className="text-heading-lg" style={{ marginBottom: '20px' }}>
                  Task Breakdown
                </h3>
                
                {totalTasks === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                    <p className="text-secondary">No tasks yet. Create some tasks to see analytics!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasks.slice(0, 10).map((task) => (
                      <div key={task.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        background: '#FAFAF9'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: task.status === 'completed' ? '#10B981' : task.status === 'in_progress' ? '#F4C542' : '#3B82F6',
                          flexShrink: 0
                        }}></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="text-label" style={{ fontSize: '14px', marginBottom: '4px' }}>
                            {task.title}
                          </p>
                          {task.assigned_to_user && (
                            <p className="text-meta">
                              Assigned to: {task.assigned_to_user.name || task.assigned_to_user.email}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
