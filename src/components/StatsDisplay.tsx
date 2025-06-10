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
      </div>
      <button className="reset-button" onClick={handleReset}>
        Resetear Estadísticas
      </button>
    </div>
  );
};

export default StatsDisplay;