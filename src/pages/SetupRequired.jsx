import { isConfigured } from '../services/supabase';

const SetupRequired = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5F5F4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="saas-card" style={{ maxWidth: '800px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <img 
              src="/logo.png" 
              alt="SprintOS Logo" 
              style={{ 
                width: '64px', 
                height: '64px',
                objectFit: 'contain'
              }} 
            />
            <div style={{ fontSize: '64px' }}>⚙️</div>
          </div>
          <h1 className="text-heading-xl" style={{ fontSize: '32px', marginBottom: '8px' }}>
            Setup Required
          </h1>
          <p className="text-secondary">SprintOS needs to be configured before use</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Supabase Configuration Missing
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The application requires a Supabase backend to function.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Setup Steps:</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Create Supabase Project</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Run Database Schema</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    In Supabase SQL Editor, run the <code className="bg-gray-100 px-2 py-1 rounded">supabase-schema.sql</code> file from the project root
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Get API Credentials</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    From Project Settings → API, copy your Project URL and anon/public key
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Update .env File</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    Edit <code className="bg-gray-100 px-2 py-1 rounded">mini-team-os/.env</code> with your credentials:
                  </p>
                  <div className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                    <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbG...your_key_here</div>
                    <div>VITE_CHATANYWHERE_API_KEY=sk-...optional</div>
                    <div>VITE_CHATANYWHERE_BASE_URL=https://api.chatanywhere.tech/v1</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Restart Dev Server</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    Stop and restart <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> to load new environment variables
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📚 Documentation</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• README.md - Complete setup guide</li>
              <li>• QUICKSTART.md - Quick start instructions</li>
              <li>• supabase-schema.sql - Database schema</li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              🔄 Refresh After Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupRequired;
