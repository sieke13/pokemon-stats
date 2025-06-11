import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Usar CountAPI - servicio gratuito de contadores
    const fetchVisitCount = async () => {
      try {
        // Reemplaza 'pokemon-stats-app' con un identificador único para tu app
        const response = await fetch('https://api.countapi.xyz/hit/pokemon-stats-app/visits');
        const data = await response.json();
        setVisitCount(data.value);
      } catch (error) {
        console.error('Error fetching visit count:', error);
        // Fallback a contador local
        const localCount = localStorage.getItem('visitCount');
        const newCount = localCount ? parseInt(localCount) + 1 : 1;
        localStorage.setItem('visitCount', newCount.toString());
        setVisitCount(newCount);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitCount();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Made with 👾 by Sieke</p>
        <div className="visit-counter">
          {loading ? (
            <span className="counter-text">Cargando...</span>
          ) : (
            <span className="counter-text">
              👁️ {visitCount.toLocaleString()} visitas
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;