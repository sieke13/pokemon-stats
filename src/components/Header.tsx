import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Pokemon Go Battle Stats</h1>
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