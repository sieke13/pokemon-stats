import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './StatsDisplay.css';

interface StatsDisplayProps {
  victories: number;
  defeats: number;
  winPercentage: number;
  onReset: () => void;
  onManualUpdate: (type: 'victories' | 'defeats', value: number) => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  victories,
  defeats,
  winPercentage,
  onReset,
  onManualUpdate
}) => {
  const { t } = useTranslation();
  const [isEditingVictories, setIsEditingVictories] = useState(false);
  const [isEditingDefeats, setIsEditingDefeats] = useState(false);
  const [tempVictories, setTempVictories] = useState(victories.toString());
  const [tempDefeats, setTempDefeats] = useState(defeats.toString());

  const handleVictoriesEdit = () => {
    setTempVictories(victories.toString());
    setIsEditingVictories(true);
  };

  const handleDefeatsEdit = () => {
    setTempDefeats(defeats.toString());
    setIsEditingDefeats(true);
  };

  const handleVictoriesSave = () => {
    const newValue = parseInt(tempVictories) || 0;
    if (newValue >= 0) {
      onManualUpdate('victories', newValue);
    }
    setIsEditingVictories(false);
  };

  const handleDefeatsSave = () => {
    const newValue = parseInt(tempDefeats) || 0;
    if (newValue >= 0) {
      onManualUpdate('defeats', newValue);
    }
    setIsEditingDefeats(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'victories' | 'defeats') => {
    if (e.key === 'Enter') {
      if (type === 'victories') {
        handleVictoriesSave();
      } else {
        handleDefeatsSave();
      }
    } else if (e.key === 'Escape') {
      if (type === 'victories') {
        setIsEditingVictories(false);
        setTempVictories(victories.toString());
      } else {
        setIsEditingDefeats(false);
        setTempDefeats(defeats.toString());
      }
    }
  };

  return (
    <div className="stats-container">
      <h2>{t('stats.statistics')}</h2>
      <div className="stats-grid">
        <div className="stat-box victories">
          <h3>{t('stats.victories')}</h3>
          {isEditingVictories ? (
            <div className="edit-container">
              <input
                type="number"
                value={tempVictories}
                onChange={(e) => setTempVictories(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'victories')}
                onBlur={handleVictoriesSave}
                autoFocus
                min="0"
                className="stat-input"
              />
            </div>
          ) : (
            <p onClick={handleVictoriesEdit} className="editable-stat">
              {victories}
            </p>
          )}
        </div>
        <div className="stat-box defeats">
          <h3>{t('stats.defeats')}</h3>
          {isEditingDefeats ? (
            <div className="edit-container">
              <input
                type="number"
                value={tempDefeats}
                onChange={(e) => setTempDefeats(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'defeats')}
                onBlur={handleDefeatsSave}
                autoFocus
                min="0"
                className="stat-input"
              />
            </div>
          ) : (
            <p onClick={handleDefeatsEdit} className="editable-stat">
              {defeats}
            </p>
          )}
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