import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Pokemon Go Battle Stats</h1>
      <nav className="header-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/teams">Equipos</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;