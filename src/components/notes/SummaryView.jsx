const SummaryView = ({ summary, onConvertToTask }) => {
  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Summary</h3>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-gray-600 mb-2">No summaries yet</p>
          <p className="text-sm text-gray-500">
            Add notes and click "Generate AI Summary" to get started
          </p>
        </div>
      </div>
    );
  }

  const actionItems = summary.action_items || [];

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latest AI Summary</h3>
        <span className="text-xs text-gray-500">
          {new Date(summary.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{summary.summary_text}</p>
        </div>
      </div>

      {actionItems.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Action Items</h4>
          <div className="space-y-2">
            {actionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition"
              >
                <div className="flex items-start flex-1">
                  <span className="text-blue-600 mr-2 font-semibold">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
                <button
                  onClick={() => onConvertToTask(item)}
                  className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition hover:bg-blue-700"
                  title="Convert to task"
                >
                  + Task
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Click the "+ Task" button to convert action items into tasks
        </p>
      </div>
    </div>
  );
};

export default SummaryView;
