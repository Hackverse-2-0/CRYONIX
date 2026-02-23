const NotesList = ({ notes, currentUserId, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-600">Create your first note to capture meeting insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">
                By {note.creator?.name || note.creator?.email} • {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
            {note.created_by === currentUserId && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(note)}
                  className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
