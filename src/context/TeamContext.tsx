import React, { createContext, useContext, useState, useCallback } from 'react';

interface Pokemon {
  id: number;
  name: string;
  nickname?: string;
  spriteUrl: string;
  pokedexNumber: number;
}

interface Team {
  id: string;
  name: string;
  pokemon: (Pokemon | null)[];
}

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (teamId: string) => void;
  addTeam: (name: string) => string; // Returns team ID
  deleteTeam: (teamId: string) => void;
  updateTeam: (teamId: string, newPokemon: (Pokemon | null)[]) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const handleSetCurrentTeam = useCallback((teamId: string) => {
    const team = teams.find(t => t.id === teamId) || null;
    setCurrentTeam(team);
  }, [teams]);

  const addTeam = useCallback((name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      pokemon: Array(3).fill(null)
    };
    
    setTeams(prev => {
      const updated = [...prev, newTeam];
      console.log('Teams after adding:', updated);
      return updated;
    });
    
    // Set the new team as current immediately using the team object
    setCurrentTeam(newTeam);
    
    return newTeam.id;
  }, []);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
  }, [currentTeam]);

  const updateTeam = useCallback((teamId: string, newPokemon: (Pokemon | null)[]) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, pokemon: newPokemon } : team
    ));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(prev => prev ? { ...prev, pokemon: newPokemon } : null);
    }
  }, [currentTeam]);

  return (
    <TeamContext.Provider value={{
      teams,
      currentTeam,
      setCurrentTeam: handleSetCurrentTeam,
      addTeam,
      deleteTeam,
      updateTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};