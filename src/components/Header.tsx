import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-banner">
        <img 
          src="/assets/header-banner.jpg"
          alt="Pokemon Stats Banner" 
          className="header-image"
        />
      </div>
      <nav className="header-nav">
        <ul>
          <li>
            <NavLink to="/" className="nav-link">
              {t('nav.home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/teams" className="nav-link">
              {t('nav.teams')}
            </NavLink>
          </li>
        </ul>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;