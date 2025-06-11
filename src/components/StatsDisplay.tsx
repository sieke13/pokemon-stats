import React from 'react';
import { useTranslation } from 'react-i18next';
import './StatsDisplay.css';

interface StatsDisplayProps {
  victories: number;
  defeats: number;
  winPercentage: number;
  onReset: () => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  victories,
  defeats,
  winPercentage,
  onReset
}) => {
  const { t } = useTranslation();

  return (
    <div className="stats-container">
      <h2>{t('stats.statistics')}</h2>
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
          <h3>{t('stats.winRate')}</h3>
          <p>{Number(winPercentage).toFixed(4)}%</p>
        </div>
        <div className="stat-box classification">
          <h3>{t('stats.classification')}</h3>
          <p>{victories * 15 + defeats * 10} (Ace)</p>
        </div>
      </div>
      <button className="reset-button" onClick={onReset}>
        {t('buttons.reset')}
      </button>
    </div>
  );
};

export default StatsDisplay;