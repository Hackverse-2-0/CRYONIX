import { useState, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import { supabase } from '../services/supabase';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';

const Tasks = () => {
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (currentTeam) {
      fetchTasks();
      subscribeToTasks();
    }
  }, [currentTeam]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to_user:users(name, email)
        `)
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `team_id=eq.${currentTeam.id}`
        }, 
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task from the mission?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
          <h2 className="text-heading-lg" style={{ marginBottom: '12px' }}>No Team Selected</h2>
          <p className="text-secondary">Select a team from the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F4' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar onNewTask={handleCreateTask} />

        <main style={{ flex: 1, padding: '24px 32px 32px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <h1 className="text-heading-xl" style={{ marginBottom: '4px' }}>Tasks</h1>
              <p className="text-secondary">{currentTeam?.name || 'Team'} • {tasks.length} total tasks</p>
            </div>
            <button
              onClick={handleCreateTask}
              className="pill-button"
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'pill-button' : 'pill-button-secondary'}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'pill-button' : 'pill-button-secondary'}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Pending ({tasks.filter(t => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={filter === 'in_progress' ? 'pill-button' : 'pill-button-secondary'}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              In Progress ({tasks.filter(t => t.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'pill-button' : 'pill-button-secondary'}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>

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
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </main>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleFormClose}
          teamId={currentTeam.id}
        />
      )}
    </div>
  );
};

export default Tasks;
