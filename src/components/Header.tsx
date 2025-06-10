import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-banner">
        <img 
          src="/assets/header-banner.jpg"  // Path from public folder
          alt="Pokemon Stats Banner" 
          className="header-image"
        />
      </div>
      <nav className="header-nav">
        <ul>
          <li>
            <NavLink to="/" className="nav-link">
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/teams" className="nav-link">
              Equipos
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;