import { useState, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import { supabase } from '../services/supabase';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import TeamSelector from '../components/dashboard/TeamSelector';

const Dashboard = () => {
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState([]);
  const [latestSummary, setLatestSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

      const { data: summaryData } = await supabase
        .from('ai_summaries')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setTasks(tasksData || []);
      setLatestSummary(summaryData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 max-w-md text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold neon-text mb-4">Welcome to SprintOS</h2>
          <p className="text-slate-200 mb-6">Create or select a team to begin your mission</p>
          <TeamSelector />
        </div>
      </div>
    );
  }

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.created_at).toDateString();
    return today === taskDate;
  });

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 ml-20">
        <TopBar title="Mission Control" progressPercentage={progressPercentage} />

        <main className="p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-neon-purple/30 border-b-neon-purple rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card-hover p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Today's Sprint</h3>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl font-bold neon-text mb-2">{todaysTasks.length}</div>
                  <p className="text-sm text-slate-200">Tasks created today</p>
                </div>

                <div className="glass-card-hover p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Active Tasks</h3>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{inProgressTasks}</div>
                  <p className="text-sm text-slate-200">In progress now</p>
                </div>

                <div className="glass-card-hover p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Completed</h3>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-2">{completedTasks}</div>
                  <p className="text-sm text-slate-200">Tasks finished</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
                      <a href="/tasks" className="text-neon-blue hover:text-neon-purple text-sm font-semibold transition-colors">
                        View All →
                      </a>
                    </div>
                    
                    {tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-4 opacity-50">📋</div>
                        <p className="text-slate-200">No tasks yet. Create your first task to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.slice(0, 5).map(task => (
                          <div key={task.id} className="glass-card p-4 hover:bg-white/10 transition-all group">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-slate-200 line-clamp-1">{task.description}</p>
                                )}
                              </div>
                              <span className={`status-${task.status.replace('_', '-')} ml-4`}>
                                {task.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <a href="/tasks" className="glass-button text-center">
                        <span>➕ New Task</span>
                      </a>
                      <a href="/notes" className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold shadow-glow-purple hover:scale-105 transition-all duration-300 text-center">
                        <span>📝 Add Note</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6 border-2 border-neon-blue/30 shadow-glow-blue">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">AI Summary</h3>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-xs font-bold animate-pulse-slow">
                        POWERED BY AI
                      </span>
                    </div>

                    {latestSummary ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-sm text-slate-200 mb-3 line-clamp-4">{latestSummary.summary_text}</p>
                          <p className="text-xs text-slate-300">
                            {new Date(latestSummary.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {latestSummary.action_items && latestSummary.action_items.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-neon-blue mb-2">Action Items</h4>
                            <div className="space-y-2">
                              {latestSummary.action_items.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-start space-x-2 text-sm text-slate-200">
                                  <span className="text-neon-purple font-bold">•</span>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <a href="/notes" className="block text-center text-neon-blue hover:text-neon-purple text-sm font-semibold transition-colors">
                          View Full Summary →
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">🤖</div>
                        <p className="text-sm text-slate-200 mb-4">No AI summaries yet</p>
                        <a href="/notes" className="text-neon-blue hover:text-neon-purple text-sm font-semibold">
                          Generate Summary →
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Team Velocity</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-200">Completion Rate</span>
                          <span className="text-white font-semibold">{progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <div className="text-2xl font-bold text-blue-400">{pendingTasks}</div>
                          <div className="text-xs text-slate-200 mt-1">Pending</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                          <div className="text-2xl font-bold text-yellow-400">{inProgressTasks}</div>
                          <div className="text-xs text-slate-200 mt-1">Active</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                          <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
                          <div className="text-xs text-slate-200 mt-1">Done</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
