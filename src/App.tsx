import React, { useState, useEffect } from 'react';
import BattleCounter from './components/BattleCounter';
import StatsDisplay from './components/StatsDisplay';
import Header from './components/Header';
import GameCalendar from './components/GameCalendar';
import PokemonTeam from './components/PokemonTeam';

interface Pokemon {
  id: number;
  name: string;
  nickname?: string;
  spriteUrl?: string;
  pokedexNumber?: number;
}

interface StoredData {
  victories: number;
  defeats: number;
  playedDates: string[];
  team: (Pokemon | null)[];
}

const App: React.FC = () => {
  const [victories, setVictories] = useState(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored ? JSON.parse(stored).victories : 0;
  });
  
  const [defeats, setDefeats] = useState(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored ? JSON.parse(stored).defeats : 0;
  });
  
  const [playedDates, setPlayedDates] = useState<Date[]>(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored 
      ? JSON.parse(stored).playedDates.map((date: string) => new Date(date))
      : [];
  });

  const [team, setTeam] = useState<(Pokemon | null)[]>(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored 
      ? JSON.parse(stored).team || Array(6).fill(null)
      : Array(6).fill(null);
  });

  useEffect(() => {
    const data: StoredData = {
      victories,
      defeats,
      playedDates: playedDates.map(date => date.toISOString()),
      team
    };
    localStorage.setItem('pokemonStats', JSON.stringify(data));
  }, [victories, defeats, playedDates, team]);

  const incrementVictories = () => setVictories(victories + 1);
  const incrementDefeats = () => setDefeats(defeats + 1);
  const decrementVictories = () => setVictories(Math.max(0, victories - 1));
  const decrementDefeats = () => setDefeats(Math.max(0, defeats - 1));

  const totalBattles = victories + defeats;
  const winPercentage = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;

  const handleDateToggle = (date: Date) => {
    setPlayedDates(prevDates => {
      const isDatePlayed = prevDates.some(playedDate => 
        playedDate.getDate() === date.getDate() &&
        playedDate.getMonth() === date.getMonth() &&
        playedDate.getFullYear() === date.getFullYear()
      );

      if (isDatePlayed) {
        return prevDates.filter(playedDate => 
          playedDate.getDate() !== date.getDate() ||
          playedDate.getMonth() !== date.getMonth() ||
          playedDate.getFullYear() !== date.getFullYear()
        );
      } else {
        return [...prevDates, date];
      }
    });
  };

  const handleReset = () => {
    setVictories(0);
    setDefeats(0);
    setPlayedDates([]);
    setTeam(Array(6).fill(null));
    localStorage.removeItem('pokemonStats');
  };

  const handleTeamUpdate = (newTeam: (Pokemon | null)[]) => {
    setTeam(newTeam);
  };

  return (
    <div>
      <Header />
      <GameCalendar 
        playedDates={playedDates}
        onDateToggle={handleDateToggle}
      />
      <PokemonTeam 
        team={team}
        onTeamUpdate={handleTeamUpdate}
      />
      <BattleCounter 
        onVictory={incrementVictories}
        onDefeat={incrementDefeats}
        onRemoveVictory={decrementVictories}
        onRemoveDefeat={decrementDefeats}
      />
      <StatsDisplay 
        victories={victories} 
        defeats={defeats} 
        winPercentage={winPercentage}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;