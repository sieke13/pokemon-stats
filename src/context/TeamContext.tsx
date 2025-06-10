import React, { createContext, useContext, useState, useEffect } from 'react';

interface Pokemon {
  id: number;
  name: string;
  nickname?: string;
  spriteUrl?: string;
  pokedexNumber?: number;
}

interface PokemonTeam {
  id: string;
  name: string;
  pokemon: (Pokemon | null)[];
  createdAt: Date;
}

interface TeamContextType {
  teams: PokemonTeam[];
  currentTeam: PokemonTeam | null;
  addTeam: (name: string, pokemon: (Pokemon | null)[]) => void;
  updateTeam: (id: string, pokemon: (Pokemon | null)[]) => void;
  deleteTeam: (id: string) => void;
  setCurrentTeam: (id: string) => void;
}

export const TeamContext = createContext<TeamContextType | null>(null);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<PokemonTeam[]>(() => {
    const stored = localStorage.getItem('pokemonTeams');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentTeam, setCurrentTeam] = useState<PokemonTeam | null>(null);

  useEffect(() => {
    localStorage.setItem('pokemonTeams', JSON.stringify(teams));
  }, [teams]);

  const addTeam = (name: string, pokemon: (Pokemon | null)[]) => {
    const newTeam: PokemonTeam = {
      id: Date.now().toString(),
      name,
      pokemon,
      createdAt: new Date()
    };
    setTeams([...teams, newTeam]);
    setCurrentTeam(newTeam);
  };

  const updateTeam = (id: string, pokemon: (Pokemon | null)[]) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, pokemon } : team
    ));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
    if (currentTeam?.id === id) {
      setCurrentTeam(null);
    }
  };

  return (
    <TeamContext.Provider value={{
      teams,
      currentTeam,
      addTeam,
      updateTeam,
      deleteTeam,
      setCurrentTeam: (id: string) => {
        const team = teams.find(t => t.id === id);
        setCurrentTeam(team || null);
      }
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