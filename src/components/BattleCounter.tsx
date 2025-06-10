import React from 'react';
import './BattleCounter.css';

interface BattleCounterProps {
  onVictory: () => void;
  onDefeat: () => void;
  onRemoveVictory: () => void;
  onRemoveDefeat: () => void;
}

const BattleCounter: React.FC<BattleCounterProps> = ({
  onVictory,
  onDefeat,
  onRemoveVictory,
  onRemoveDefeat
}) => {
  return (
    <div className="battle-counter">
      <div className="button-group">
        <button className="button victory" onClick={onVictory}>
          Victoria +
        </button>
        <button className="button victory-remove" onClick={onRemoveVictory}>
          Victoria -
        </button>
      </div>
      <div className="button-group">
        <button className="button defeat" onClick={onDefeat}>
          Derrota +
        </button>
        <button className="button defeat-remove" onClick={onRemoveDefeat}>
          Derrota -
        </button>
      </div>
    </div>
  );
};

export default BattleCounter;