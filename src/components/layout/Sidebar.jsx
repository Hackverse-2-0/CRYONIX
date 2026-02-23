import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navigation = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Tasks', 
      path: '/tasks', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      name: 'Notes', 
      path: '/notes', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      name: 'AI Summary', 
      path: '/notes',
      badge: 'AI',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 lg:w-64 glass-card border-r border-white/10 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold neon-text hidden lg:block">SprintOS</h1>
        <div className="lg:hidden flex justify-center">
          <span className="text-2xl font-bold neon-text">S</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 shadow-glow-blue'
                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <div className={`${isActive(item.path) ? 'text-neon-blue' : 'text-slate-300 group-hover:text-white'} transition-colors`}>
              {item.icon}
            </div>
            <span className={`hidden lg:block font-medium ${isActive(item.path) ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
              {item.name}
            </span>
            {item.badge && (
              <span className="hidden lg:block ml-auto px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-pulse-slow text-white">
                {item.badge}
              </span>
            )}
            {isActive(item.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-neon-blue to-neon-purple rounded-r-full"></div>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass-card p-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.name || 'User'}</p>
              <p className="text-xs text-slate-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center lg:justify-start space-x-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden lg:block text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
