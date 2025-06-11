import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BattleCounter.css';

interface BattleCounterProps {
  onVictory: () => void;
  onDefeat: () => void;
  onVictoryRemove: () => void;
  onDefeatRemove: () => void;
  victories: number;
  defeats: number;
  onManualUpdate: (type: 'victories' | 'defeats', value: number) => void;
}

const BattleCounter: React.FC<BattleCounterProps> = ({
  onVictory,
  onDefeat,
  onVictoryRemove,
  onDefeatRemove,
  victories,
  defeats,
  onManualUpdate
}) => {
  const { t } = useTranslation();
  const [isEditingVictories, setIsEditingVictories] = useState(false);
  const [isEditingDefeats, setIsEditingDefeats] = useState(false);

  const handleNumberChange = (type: 'victories' | 'defeats', value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      onManualUpdate(type, numValue);
    }
  };

  return (
    <div className="battle-counter">
      <div className="stats-header">
        <h2>{t('stats.statistics')}</h2>
      </div>
      
      <div className="stats-grid">
        <div className="counter-section victory-section">
          <h3>{t('stats.victories')}</h3>
          <div className="counter-display" onClick={() => setIsEditingVictories(true)}>
            {isEditingVictories ? (
              <input
                type="number"
                value={victories}
                onChange={(e) => handleNumberChange('victories', e.target.value)}
                onBlur={() => setIsEditingVictories(false)}
                autoFocus
                min="0"
                className="counter-input"
              />
            ) : (
              <span className="counter-number">{victories}</span>
            )}
          </div>
          <div className="button-group">
            <button className="button victory" onClick={onVictory}>+</button>
            <button className="button victory-remove" onClick={onVictoryRemove}>-</button>
          </div>
        </div>

        <div className="counter-section defeat-section">
          <h3>{t('stats.defeats')}</h3>
          <div className="counter-display" onClick={() => setIsEditingDefeats(true)}>
            {isEditingDefeats ? (
              <input
                type="number"
                value={defeats}
                onChange={(e) => handleNumberChange('defeats', e.target.value)}
                onBlur={() => setIsEditingDefeats(false)}
                autoFocus
                min="0"
                className="counter-input"
              />
            ) : (
              <span className="counter-number">{defeats}</span>
            )}
          </div>
          <div className="button-group">
            <button className="button defeat" onClick={onDefeat}>+</button>
            <button className="button defeat-remove" onClick={onDefeatRemove}>-</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleCounter;