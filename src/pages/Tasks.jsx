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
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Team Selected</h2>
          <p className="text-gray-400">Select a team from the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 ml-20">
        <TopBar title="Task Command Center" progressPercentage={progressPercentage} />

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold neon-text mb-2">Mission Tasks</h1>
              <p className="text-gray-400">{currentTeam.name} • {tasks.length} total tasks</p>
            </div>
            <button
              onClick={handleCreateTask}
              className="glass-button"
            >
              ➕ Deploy New Task
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-glow-blue'
                  : 'glass-card hover:bg-white/10'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'pending'
                  ? 'bg-blue-500/30 text-blue-300 border-2 border-blue-400'
                  : 'glass-card hover:bg-white/10'
              }`}
            >
              Pending ({tasks.filter(t => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'in_progress'
                  ? 'bg-yellow-500/30 text-yellow-300 border-2 border-yellow-400'
                  : 'glass-card hover:bg-white/10'
              }`}
            >
              Active ({tasks.filter(t => t.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'completed'
                  ? 'bg-green-500/30 text-green-300 border-2 border-green-400'
                  : 'glass-card hover:bg-white/10'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>

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
