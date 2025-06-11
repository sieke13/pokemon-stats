import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BattleStats.css';

interface BattleStatsProps {
  victories: number;
  defeats: number;
  onManualUpdate: (type: 'victories' | 'defeats', value: number) => void;
}

const BattleStats: React.FC<BattleStatsProps> = ({
  victories,
  defeats,
  onManualUpdate
}) => {
  const { t } = useTranslation();
  const [isEditingWins, setIsEditingWins] = useState(false);
  const [isEditingBattles, setIsEditingBattles] = useState(false);
  const [tempWins, setTempWins] = useState(victories.toString());
  const [tempBattles, setTempBattles] = useState((victories + defeats).toString());

  // Calculations
  const totalBattles = victories + defeats;
  const winRate = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;
  
  // Pokémon GO ELO calculation based on GO Battle League (updated)
  const calculatePokemonGOELO = () => {
    // Base rating más realista basado en datos reales
    let rating = 1200; // Base inicial más baja
    
    // Calculate win rate
    const currentWinRate = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;
    
    // Net wins calculation
    const netWins = victories - defeats;
    
    if (totalBattles >= 25) {
      // Win rate impact (calibrado con datos reales)
      if (currentWinRate >= 80) rating += 1800;      // Excepcional (>80%)
      else if (currentWinRate >= 75) rating += 1500; // Muy alto (75-80%)
      else if (currentWinRate >= 70) rating += 1200; // Alto (70-75%)
      else if (currentWinRate >= 65) rating += 950;  // Bueno (65-70%)
      else if (currentWinRate >= 60) rating += 750;  // Por encima del promedio (60-65%)
      else if (currentWinRate >= 58) rating += 700;  // Ligeramente superior (58-60%)
      else if (currentWinRate >= 55) rating += 650;  // Promedio alto (55-58%)
      else if (currentWinRate >= 50) rating += 500;  // Promedio (50-55%)
      else if (currentWinRate >= 45) rating += 350;  // Bajo promedio (45-50%)
      else if (currentWinRate >= 40) rating += 200;  // Pobre (40-45%)
      else rating += 50;                             // Muy pobre (<40%)
      
      // Net wins impact (principal factor después del win rate)
      rating += netWins * 3.5;
      
    } else {
      // Para jugadores con pocas batallas
      rating = 1200 + (netWins * 8);
    }
    
    // Bounds más realistas basados en datos reales
    return Math.max(1000, Math.min(3500, Math.round(rating)));
  };

  const rating = calculatePokemonGOELO();

  // Pokémon GO Battle League Ranks (only the 4 main ranks)
  const getPokemonGORank = (rating: number) => {
    if (rating < 2500) return { 
      name: t('trainer.rank.ace'),
      icon: t('trainer.rank.bronze'),
      league: t('trainer.rank.ace'),
      description: t('trainer.rank.skilled'),
      minRating: 1200,
      nextRating: 2500,  // Corregido: Veterano es a 2500
      className: 'rank-ace'
    };
    
    if (rating < 2750) return { 
      name: t('trainer.rank.veteran'), 
      icon: t('trainer.rank.silver'),
      league: t('trainer.rank.veteran'),
      description: t('trainer.rank.skillLevel.veteran'),
      minRating: 2500,   // Corregido: Veterano empieza en 2500
      nextRating: 2750,  // Corregido: Experto es a 2750
      className: 'rank-veteran'
    };
    
    if (rating < 3000) return { 
      name: t('trainer.rank.expert'), 
      icon: t('trainer.rank.gold'),
      league: t('trainer.rank.expert'),
      description: t('trainer.rank.skillLevel.expert'),
      minRating: 2750,   // Corregido: Experto empieza en 2750
      nextRating: 3000,  // Corregido: Leyenda es a 3000
      className: 'rank-expert'
    };
    
    return { 
      name: t('trainer.rank.legend'), 
      icon: '👑',
      league: t('trainer.rank.legend'),
      description: t('goBattleLeague.legendDescription'),
      minRating: 3000,   // Corregido: Leyenda empieza en 3000
      nextRating: null,
      className: 'rank-legend'
    };
  };

  const rank = getPokemonGORank(rating);

  // Calculate progress to next rank
  const getNextRankInfo = () => {
    if (!rank.nextRating) return null;
    
    const pointsNeeded = rank.nextRating - rating;
    
    // Estimate wins needed based on current performance
    let estimatedPointsPerWin = 15;
    if (winRate >= 70) estimatedPointsPerWin = 20;
    else if (winRate >= 60) estimatedPointsPerWin = 18;
    else if (winRate >= 50) estimatedPointsPerWin = 15;
    else estimatedPointsPerWin = 12;
    
    const winsNeeded = Math.ceil(pointsNeeded / estimatedPointsPerWin);
    
    return { 
      pointsNeeded, 
      winsNeeded, 
      nextRating: rank.nextRating,
      currentProgress: ((rating - rank.minRating) / (rank.nextRating - rank.minRating)) * 100
    };
  };

  const nextRank = getNextRankInfo();

  const handleWinsEdit = () => {
    setTempWins(victories.toString());
    setIsEditingWins(true);
  };

  const handleBattlesEdit = () => {
    setTempBattles(totalBattles.toString());
    setIsEditingBattles(true);
  };

  const handleWinsSave = () => {
    const newWins = Math.max(0, parseInt(tempWins) || 0);
    const maxWins = Math.min(newWins, totalBattles);
    onManualUpdate('victories', maxWins);
    onManualUpdate('defeats', Math.max(0, totalBattles - maxWins));
    setIsEditingWins(false);
  };

  const handleBattlesSave = () => {
    const newTotal = Math.max(0, parseInt(tempBattles) || 0);
    const newDefeats = Math.max(0, newTotal - victories);
    onManualUpdate('defeats', newDefeats);
    setIsEditingBattles(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'wins' | 'battles') => {
    if (e.key === 'Enter') {
      if (type === 'wins') handleWinsSave();
      else handleBattlesSave();
    } else if (e.key === 'Escape') {
      if (type === 'wins') {
        setIsEditingWins(false);
        setTempWins(victories.toString());
      } else {
        setIsEditingBattles(false);
        setTempBattles(totalBattles.toString());
      }
    }
  };

  return (
    <div className="battle-stats">
      <div className="battle-stats-header">
        <h3>{t('goBattleLeague.title')}</h3>
      </div>
      
      <div className="battle-stats-content">
        {/* Wins / Battles Display */}
        <div className="wins-battles-section">
          <div className="stat-row">
            <span className="stat-label">{t('goBattleLeague.wins')}:</span>
            {isEditingWins ? (
              <input
                type="number"
                value={tempWins}
                onChange={(e) => setTempWins(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'wins')}
                onBlur={handleWinsSave}
                autoFocus
                min="0"
                max={totalBattles}
                className="stat-input"
              />
            ) : (
              <span className="stat-value editable" onClick={handleWinsEdit}>
                {victories}
              </span>
            )}
          </div>
          
          <div className="stat-row">
            <span className="stat-label">{t('goBattleLeague.battles')}:</span>
            {isEditingBattles ? (
              <input
                type="number"
                value={tempBattles}
                onChange={(e) => setTempBattles(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'battles')}
                onBlur={handleBattlesSave}
                autoFocus
                min={victories}
                className="stat-input"
              />
            ) : (
              <span className="stat-value editable" onClick={handleBattlesEdit}>
                {totalBattles}
              </span>
            )}
          </div>
        </div>

        {/* Win Rate */}
        <div className="win-rate-section">
          <div className="win-rate-display">
            <span className="win-rate-label">{t('goBattleLeague.winRate')}</span>
            <span className="win-rate-value">{winRate.toFixed(1)}%</span>
          </div>
          <div className="win-rate-bar">
            <div 
              className="win-rate-fill" 
              style={{ 
                width: `${Math.min(winRate, 100)}%`,
                backgroundColor: winRate >= 70 ? '#4CAF50' : 
                               winRate >= 50 ? '#FF9800' : '#f44336'
              }}
            />
          </div>
        </div>

        {/* GO Battle League Rating */}
        <div className="rating-section">
          <div className="rating-display">
            <div className="rating-value">
              <span className="rating-number">{rating}</span>
              <span className="rating-label">{t('goBattleLeague.rating')}</span>
            </div>
            <div className="rank-info">
              <div className={`rank-badge ${rank.className}`}>
                <span className="rank-icon">{rank.icon}</span>
                <span className="rank-name">{rank.name}</span>
              </div>
              <div className="league-info">
                <span className="rank-description">{rank.description}</span>
              </div>
            </div>
          </div>
          
                  {nextRank && (
                    <div className="next-rank-info">
                      <div className="progress-to-next">
                        <span className="progress-label">
                          {t('trainer.rank.progressTo')} {nextRank.nextRating === 3000 ? t('trainer.rank.legend') : 
                                     nextRank.nextRating === 2500 ? t('trainer.rank.expert') : t('trainer.rank.veteran')}
                        </span>
                        <div className="progress-details">
                          <span>{t('trainer.rank.winsNeeded', { wins: nextRank.winsNeeded })}</span>
                          <span>{t('trainer.rank.points', { points: nextRank.pointsNeeded })}</span>
                        </div>
                      </div>
                      <div className="rank-progress-bar">
                        <div 
                          className="rank-progress-fill" 
                          style={{ width: `${Math.min(nextRank.currentProgress || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        };
        
        export default BattleStats;
