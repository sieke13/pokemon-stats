import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
    // Solo agregar el equipo si tiene al menos 1 Pokémon
    if (currentTeam && currentTeam.pokemon.some((pokemon: Pokemon | null) => pokemon !== null)) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name,
        pokemon: currentTeam.pokemon
      };
      
      setTeams(prev => {
        const updated = [...prev, newTeam];
        // Guardar en localStorage
        localStorage.setItem('pokemonTeams', JSON.stringify(updated));
        return updated;
      });
      
      // Set the new team as current immediately using the team object
      setCurrentTeam(newTeam);
      
      return newTeam.id;
    } else {
      alert('Cannot save empty team!');
      return '';
    }
  }, [currentTeam]);

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

  // Carga inicial de equipos desde localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('pokemonTeams');
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        // Filtrar equipos válidos (que tengan al menos 1 Pokémon)
        const validTeams = parsedTeams.filter((team: Team) => 
          team.pokemon && team.pokemon.some((pokemon: Pokemon | null) => pokemon !== null)
        );
        setTeams(validTeams);
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
      }
    }
  }, []);

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