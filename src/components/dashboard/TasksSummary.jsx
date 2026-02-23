const TasksSummary = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">{tasks.length}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">In Progress</span>
          <span className="text-xl font-semibold text-yellow-600">{inProgressTasks}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Pending</span>
          <span className="text-xl font-semibold text-blue-600">{pendingTasks}</span>
        </div>
      </div>

      {tasks.length === 0 && (
        <p className="text-gray-400 text-sm mt-4">No tasks created today</p>
      )}
    </div>
  );
};

export default TasksSummary;
