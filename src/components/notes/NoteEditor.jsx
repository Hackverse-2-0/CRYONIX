import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const NoteEditor = ({ note, onClose, teamId, userId }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Note content cannot be empty');
      return;
    }

    setLoading(true);

    try {
      if (note) {
        const { error } = await supabase
          .from('notes')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', note.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert([{
            team_id: teamId,
            content,
            created_by: userId
          }]);

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {note ? 'Edit Note' : 'Create New Note'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Write your meeting notes here...

Example:
- Discussed project timeline
- Decided to use React for frontend
- John will handle authentication
- Sarah will design the UI"
            />
            <p className="text-sm text-gray-500 mt-2">
              Use bullet points or structured format for better AI summaries
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : (note ? 'Update Note' : 'Save Note')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
