import React from 'react';
import { useTranslation } from 'react-i18next';
import GameCalendar from '../components/GameCalendar';
import PokemonTeamComponent from '../components/PokemonTeam';
import BattleCounter from '../components/BattleCounter';
import BattleStats from '../components/BattleStats';
import { useTeams } from '../context/TeamContext';

interface HomeProps {
  victories: number;
  defeats: number;
  winPercentage: number;
  playedDates: Date[];
  onDateToggle: (date: Date) => void;
  incrementVictories: () => void;
  incrementDefeats: () => void;
  decrementVictories: () => void;
  decrementDefeats: () => void;
  handleReset: () => void;
  onManualUpdate: (type: 'victories' | 'defeats', value: number) => void;
}

const Home: React.FC<HomeProps> = ({
  victories,
  defeats,
  playedDates,
  onDateToggle,
  incrementVictories,
  incrementDefeats,
  decrementVictories,
  decrementDefeats,
  onManualUpdate
}) => {
  const { t } = useTranslation();
  const { currentTeam, updateTeam, addTeam, setCurrentTeam, teams } = useTeams();
  
  // Create a default team if none exists
  React.useEffect(() => {
    if (!currentTeam && teams.length === 0) {
      console.log('Creating default team');
      const newTeamId = addTeam('My Team');
      console.log('New team ID:', newTeamId);
      // The team will be set as current by the addTeam function
    } else if (!currentTeam && teams.length > 0) {
      // If teams exist but no current team is selected, select the first one
      console.log('Setting first team as current:', teams[0].id);
      setCurrentTeam(teams[0].id);
    }
  }, [currentTeam, teams, addTeam, setCurrentTeam]);
  
  return (
    <div className="home-container">
      <h1>{t('header.title')}</h1>
      <GameCalendar 
        playedDates={playedDates}
        onDateToggle={onDateToggle}
      />
      <PokemonTeamComponent 
        team={currentTeam?.pokemon || Array(3).fill(null)}
        onTeamUpdate={(pokemon) => {
          console.log('Updating team with:', pokemon);
          if (currentTeam) {
            updateTeam(currentTeam.id, pokemon);
          } else {
            console.log('No current team available');
          }
        }}
      />
      <BattleStats 
        victories={victories}
        defeats={defeats}
        onManualUpdate={onManualUpdate}
      />
      <BattleCounter 
        victories={victories}
        defeats={defeats}
        onVictory={incrementVictories}
        onDefeat={incrementDefeats}
        onVictoryRemove={decrementVictories}
        onDefeatRemove={decrementDefeats}
        onManualUpdate={onManualUpdate}
      />
    </div>
  );
};

export default Home;