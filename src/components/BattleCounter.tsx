import React from 'react';
import { useTranslation } from 'react-i18next';
import './BattleCounter.css';

interface BattleCounterProps {
  onVictory: () => void;
  onDefeat: () => void;
  onVictoryRemove: () => void;
  onDefeatRemove: () => void;
}

const BattleCounter: React.FC<BattleCounterProps> = ({
  onVictory,
  onDefeat,
  onVictoryRemove,
  onDefeatRemove
}) => {
  const { t } = useTranslation();

  return (
    <div className="battle-counter">
      <div className="button-group">
        <button className="button victory" onClick={onVictory}>
          {t('buttons.victory')}
        </button>
        <button className="button victory-remove" onClick={onVictoryRemove}>
          {t('buttons.victoryRemove')}
        </button>
        <button className="button defeat" onClick={onDefeat}>
          {t('buttons.defeat')}
        </button>
        <button className="button defeat-remove" onClick={onDefeatRemove}>
          {t('buttons.defeatRemove')}
        </button>
      </div>
    </div>
  );
};

export default BattleCounter;