const LatestSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest AI Summary</h3>
        <p className="text-gray-400">No summaries generated yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Create notes and generate summaries to see insights here
        </p>
      </div>
    );
  }

  const actionItems = summary.action_items || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest AI Summary</h3>
      
      <div className="text-sm text-gray-600 mb-3">
        {new Date(summary.created_at).toLocaleDateString()}
      </div>

      <div className="prose prose-sm max-h-32 overflow-y-auto mb-3">
        <p className="text-gray-700">{summary.summary_text.substring(0, 150)}...</p>
      </div>

      {actionItems.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Action Items</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {actionItems.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LatestSummary;
