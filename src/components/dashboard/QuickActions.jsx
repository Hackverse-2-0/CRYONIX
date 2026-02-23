import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/tasks"
          className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition border-2 border-blue-200"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">✓</div>
            <div className="font-semibold text-gray-900">Manage Tasks</div>
            <div className="text-sm text-gray-600 mt-1">Create and track tasks</div>
          </div>
        </Link>

        <Link
          to="/notes"
          className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition border-2 border-green-200"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold text-gray-900">Add Notes</div>
            <div className="text-sm text-gray-600 mt-1">Capture meeting notes</div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition border-2 border-purple-200"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">View Analytics</div>
            <div className="text-sm text-gray-600 mt-1">Track team progress</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
