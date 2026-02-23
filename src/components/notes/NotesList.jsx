const NotesList = ({ notes, currentUserId, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="saas-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
        <h3 className="text-heading-lg" style={{ marginBottom: '8px' }}>No notes yet</h3>
        <p className="text-secondary">Create your first note to capture meeting insights</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {notes.map(note => (
        <div key={note.id} className="saas-card hover-overlay">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'start', 
            marginBottom: '16px' 
          }}>
            <div>
              <div className="text-meta">
                By {note.creator?.name || note.creator?.email} • {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
            {note.created_by === currentUserId && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onEdit(note)}
                  className="pill-button-secondary"
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px',
                    color: '#3B82F6',
                    borderColor: '#3B82F6'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="pill-button-secondary"
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px',
                    color: '#EF4444',
                    borderColor: '#EF4444'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#FEF2F2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div style={{ lineHeight: '1.7' }}>
            <p className="text-body" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
