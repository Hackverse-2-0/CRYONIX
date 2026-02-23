import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

const TeamContext = createContext({});

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setLoading(false);
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const userTeams = data.map(item => item.teams);
      setTeams(userTeams);

      if (userTeams.length > 0 && !currentTeam) {
        setCurrentTeam(userTeams[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const createTeam = async (name, projectName) => {
    try {
      const { data, error } = await supabase
        .rpc('create_team_with_invite_code', {
          p_team_name: name,
          p_project_name: projectName,
          p_user_id: user.id
        });

      if (error) throw error;

      await fetchTeams();
      
      // Find the newly created team and set it as current
      const newTeam = teams.find(t => t.id === data[0].team_id) || 
                      (await supabase.from('teams').select('*').eq('id', data[0].team_id).single()).data;
      
      setCurrentTeam(newTeam);

      return { data: { ...newTeam, invite_code: data[0].invite_code }, error: null };
    } catch (error) {
      console.error('Error creating team:', error);
      return { data: null, error };
    }
  };

  const switchTeam = (team) => {
    setCurrentTeam(team);
  };

  const value = {
    currentTeam,
    teams,
    loading,
    createTeam,
    switchTeam,
    refreshTeams: fetchTeams
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};
