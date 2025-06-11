import React from 'react';
import { useTranslation } from 'react-i18next';
import './GameLog.css';

interface GameLogProps {
  playedDates: Date[];
  victories: number;
  defeats: number;
}

const GameLog: React.FC<GameLogProps> = ({ playedDates, victories, defeats }) => {
  const { t } = useTranslation();

  return (
    <div className="game-log">
      <h2>{t('gameLog.title')}</h2>
      {playedDates.length === 0 ? (
        <p className="no-games">{t('gameLog.noGames')}</p>
      ) : (
        <>
          <div className="game-stats">
            <p>{t('gameLog.total')}: {playedDates.length}</p>
            <p>{t('gameLog.victory')}: {victories}</p>
            <p>{t('gameLog.defeat')}: {defeats}</p>
          </div>
          <div className="games-list">
            {/* ...existing code... */}
          </div>
        </>
      )}
    </div>
  );
};

export default GameLog;