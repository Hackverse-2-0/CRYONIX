import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { generateSummary, parseActionItems } from '../services/chatAnywhere';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
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
    const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      // Immediately update local state for better UX
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      // Show success message
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleGenerateSummary = async () => {
    if (notes.length === 0) {
      alert('No notes to summarize. Please add some notes first.');
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
      
      if (result.success) {
        alert('✅ AI Summary generated successfully!');
      } else {
        alert('⚠️ Generated mock summary (API unavailable). Please check your API key configuration.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('❌ Failed to generate summary. Error: ' + error.message);
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F4' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar onNewTask={() => {}} />

        <main style={{ flex: 1, padding: '24px 32px 32px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <div>
              <h1 className="text-heading-xl" style={{ marginBottom: '4px' }}>Meeting Notes</h1>
              <p className="text-secondary">{currentTeam?.name || 'Team'}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleGenerateSummary}
                disabled={generatingSummary || notes.length === 0}
                className="pill-button"
                style={{ 
                  opacity: (generatingSummary || notes.length === 0) ? 0.5 : 1,
                  cursor: (generatingSummary || notes.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {generatingSummary ? 'Generating...' : 'Generate AI Summary'}
              </button>
              <button
                onClick={handleCreateNote}
                className="pill-button-secondary"
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Note
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr',
            gap: '24px'
          }}>
            <div>
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '400px' 
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #E5E7EB',
                    borderTop: '4px solid #F4C542',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
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

            <div>
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
    </div>
  );
};

export default Notes;
