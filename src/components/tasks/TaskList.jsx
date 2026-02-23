const TaskList = ({ tasks, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in_progress':
        return '⚡';
      case 'completed':
        return '✅';
      default:
        return '📋';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-16 text-center">
        <div className="text-7xl mb-6 opacity-50">🚀</div>
        <h3 className="text-2xl font-bold text-white mb-3">No Tasks in Queue</h3>
        <p className="text-slate-200">Deploy your first task to begin the mission</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="glass-card-hover p-6 group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="text-3xl">{getStatusIcon(task.status)}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-slate-200 mb-3">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm">
                  {task.assigned_to_user && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-slate-200">Assigned:</span>
                      <span className="text-white font-semibold">
                        {task.assigned_to_user.name || task.assigned_to_user.email}
                      </span>
                    </div>
                  )}
                  {task.deadline && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-slate-200">Due:</span>
                      <span className="text-white font-semibold">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <span className={getStatusColor(task.status)}>
                {getStatusLabel(task.status)}
              </span>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded-lg transition-all border border-neon-blue/30"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
