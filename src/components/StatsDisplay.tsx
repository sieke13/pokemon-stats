import React from 'react';
import { useTranslation } from 'react-i18next';
import './StatsDisplay.css';

interface StatsDisplayProps {
  victories: number;
  defeats: number;
  winPercentage: number;
  onReset?: () => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  victories, 
  defeats, 
  winPercentage,
  onReset 
}) => {
  const { t } = useTranslation();

  // Cálculo aproximado del ELO basado en Pokémon GO
  const calculateElo = (wins: number, losses: number): number => {
    const baseElo = 1000;
    const winBonus = wins * 15;  // Cada victoria suma aprox. 15 puntos
    const lossPenalty = losses * 10;  // Cada derrota resta aprox. 10 puntos
    const elo = baseElo + winBonus - lossPenalty;
    return Math.max(0, elo); // El ELO no puede ser negativo
  };

  const currentElo = calculateElo(victories, defeats);
  const getRank = (elo: number): string => {
    if (elo >= 3000) return "Legend";
    if (elo >= 2750) return "Expert";
    if (elo >= 2500) return "Veteran";
    if (elo >= 2000) return "Ace";
    return "Normal";
  };

  const handleReset = () => {
    if (window.confirm(t('confirmReset'))) {
      onReset?.();
    }
  };

  return (
    <div className="stats-container">
      <h2>{t('stats.title')}</h2>
      <div className="stats-grid">
        <div className="stat-box victories">
          <h3>{t('stats.victories')}</h3>
          <p>{victories}</p>
        </div>
        <div className="stat-box defeats">
          <h3>{t('stats.defeats')}</h3>
          <p>{defeats}</p>
        </div>
        <div className="stat-box percentage">
          <h3>{t('stats.winPercentage')}</h3>
          <p>{winPercentage.toFixed(1)}%</p>
        </div>
        <div className="stat-box classification">
          <h3>{t('stats.classification')}</h3>
          <p>{currentElo} ({t(`stats.ranks.${getRank(currentElo).toLowerCase()}`)})</p>
        </div>
      </div>
      <button className="reset-button" onClick={handleReset}>
        {t('buttons.reset')}
      </button>
    </div>
  );
};

export default StatsDisplay;