import React from 'react';
import { useTranslation } from 'react-i18next';
import GameCalendar from '../components/GameCalendar';
import PokemonTeam from '../components/PokemonTeam';
import BattleCounter from '../components/BattleCounter';
import StatsDisplay from '../components/StatsDisplay';

interface HomeProps {
  victories: number;
  defeats: number;
  winPercentage: number;
  playedDates: Date[];
  team: any[];
  onDateToggle: (date: Date) => void;
  onTeamUpdate: (team: any[]) => void;
  incrementVictories: () => void;
  incrementDefeats: () => void;
  decrementVictories: () => void;
  decrementDefeats: () => void;
  handleReset: () => void;
}

const Home: React.FC<HomeProps> = ({
  victories,
  defeats,
  winPercentage,
  playedDates,
  team,
  onDateToggle,
  onTeamUpdate,
  incrementVictories,
  incrementDefeats,
  decrementVictories,
  decrementDefeats,
  handleReset
}) => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <h1>{t('header.title')}</h1>
      <GameCalendar 
        playedDates={playedDates}
        onDateToggle={onDateToggle}
      />
      <PokemonTeam 
        team={team}
        onTeamUpdate={onTeamUpdate}
      />
      <BattleCounter 
        onVictory={incrementVictories}
        onDefeat={incrementDefeats}
        onVictoryRemove={decrementVictories}
        onDefeatRemove={decrementDefeats}
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

export default Home;