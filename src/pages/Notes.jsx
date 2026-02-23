import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { generateSummary, parseActionItems } from '../services/chatAnywhere';
import NotesList from '../components/notes/NotesList';
import NoteEditor from '../components/notes/NoteEditor';
import SummaryView from '../components/notes/SummaryView';

const Notes = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [latestSummary, setLatestSummary] = useState(null);

  useEffect(() => {
    if (currentTeam) {
      fetchNotes();
      fetchLatestSummary();
      subscribeToNotes();
    }
  }, [currentTeam]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          creator:users(name, email)
        `)
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_summaries')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setLatestSummary(data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const subscribeToNotes = () => {
    const subscription = supabase
      .channel('notes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notes',
          filter: `team_id=eq.${currentTeam.id}`
        }, 
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleGenerateSummary = async () => {
    if (notes.length === 0) {
      alert('No notes to summarize');
      return;
    }

    setGeneratingSummary(true);

    try {
      const allNotesContent = notes.map(note => note.content).join('\n\n---\n\n');
      const result = await generateSummary(allNotesContent);

      let summaryText = result.success ? result.data : result.mockData;
      const actionItems = parseActionItems(summaryText);

      const { data, error } = await supabase
        .from('ai_summaries')
        .insert([{
          team_id: currentTeam.id,
          summary_text: summaryText,
          action_items: actionItems
        }])
        .select()
        .single();

      if (error) throw error;

      setLatestSummary(data);
      alert(result.success ? 'Summary generated successfully!' : 'Generated mock summary (API unavailable)');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleConvertToTask = async (actionItem) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          team_id: currentTeam.id,
          title: actionItem,
          status: 'pending'
        }]);

      if (error) throw error;
      alert('Action item converted to task!');
    } catch (error) {
      console.error('Error converting to task:', error);
      alert('Failed to create task');
    }
  };

  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Team Selected</h2>
          <p className="text-gray-600">Please select a team from the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                Mini Team OS
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Notes</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting Notes</h1>
            <p className="text-gray-600 mt-1">{currentTeam.name}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary || notes.length === 0}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingSummary ? 'Generating...' : '✨ Generate AI Summary'}
            </button>
            <button
              onClick={handleCreateNote}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Add Note
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <NotesList
                notes={notes}
                currentUserId={user.id}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <SummaryView
              summary={latestSummary}
              onConvertToTask={handleConvertToTask}
            />
          </div>
        </div>
      </main>

      {showEditor && (
        <NoteEditor
          note={editingNote}
          onClose={() => setShowEditor(false)}
          teamId={currentTeam.id}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default Notes;
