import { useTeam } from '../../context/TeamContext';
import TeamSelector from '../dashboard/TeamSelector';

const TopBar = ({ title, progressPercentage }) => {
  const { currentTeam } = useTeam();

  return (
    <div className="glass-card border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {currentTeam ? (
            <p className="text-sm text-slate-200 truncate">
              {currentTeam.name} • {currentTeam.project_name}
            </p>
          ) : (
            <p className="text-sm text-slate-300">No team selected</p>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <TeamSelector />

          {progressPercentage !== undefined && (
            <div className="glass-card px-6 py-3 border border-neon-blue/30">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <svg className="transform -rotate-90 w-12 h-12">
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#b17aff" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#progress-gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{progressPercentage}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Progress</p>
                  <p className="text-sm font-semibold text-white">Team Sprint</p>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card px-4 py-2 border border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-200">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
