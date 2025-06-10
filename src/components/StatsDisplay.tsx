import React from 'react';
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
    if (window.confirm('¿Estás seguro de que quieres resetear todas las estadísticas?')) {
      onReset?.();
    }
  };

  return (
    <div className="stats-container">
      <h2>Estadísticas</h2>
      <div className="stats-grid">
        <div className="stat-box victories">
          <h3>Victorias</h3>
          <p>{victories}</p>
        </div>
        <div className="stat-box defeats">
          <h3>Derrotas</h3>
          <p>{defeats}</p>
        </div>
        <div className="stat-box percentage">
          <h3>Porcentaje de Victoria</h3>
          <p>{winPercentage.toFixed(1)}%</p>
        </div>
        <div className={`stat-box elo ${getRank(currentElo).toLowerCase()}`}>
          <h3>Clasificación</h3>
          <p>{currentElo} ({getRank(currentElo)})</p>
        </div>
      </div>
      <button className="reset-button" onClick={handleReset}>
        Resetear Estadísticas
      </button>
    </div>
  );
};

export default StatsDisplay;