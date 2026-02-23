import { useState } from 'react';
import { useTeam } from '../../context/TeamContext';

const TeamSelector = () => {
  const { currentTeam, teams, switchTeam, createTeam } = useTeam();
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createTeam(teamName, projectName);

    if (result.error) {
      setError(result.error.message || 'Failed to create team');
      setLoading(false);
    } else {
      setShowModal(false);
      setTeamName('');
      setProjectName('');
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        {teams.length > 0 && (
          <select
            value={currentTeam?.id || ''}
            onChange={(e) => {
              const team = teams.find(t => t.id === e.target.value);
              if (team) switchTeam(team);
            }}
            className="glass-input cursor-pointer min-w-[200px]"
          >
            <option value="" className="bg-slate-900 text-white">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id} className="bg-slate-900 text-white">
                {team.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="glass-button whitespace-nowrap"
        >
          + New Team
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md border-2 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold neon-text">🚀 Create New Team</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateTeam} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="glass-input"
                  placeholder="Alpha Squad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="glass-input"
                  placeholder="Mission Phoenix"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deploying...
                    </span>
                  ) : (
                    '🚀 Deploy Team'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-300 text-center">
                Teams are shared spaces for collaboration
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamSelector;
