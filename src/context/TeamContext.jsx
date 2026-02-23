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
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([
          {
            name,
            project_name: projectName,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      const { error: memberError } = await supabase
        .from('team_members')
        .insert([
          {
            team_id: teamData.id,
            user_id: user.id
          }
        ]);

      if (memberError) throw memberError;

      await fetchTeams();
      setCurrentTeam(teamData);

      return { data: teamData, error: null };
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
