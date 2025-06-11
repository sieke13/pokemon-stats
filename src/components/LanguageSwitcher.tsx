import React from 'react';
import { useTranslation } from 'react-i18next';
import { UKFlag, SpainFlag, IndiaFlag } from './flags/Flags';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const flagIcons = {
    en: <UKFlag />,
    es: <SpainFlag />,
    hi: <IndiaFlag />
  };

  return (
    <div className="language-switcher">
      {Object.entries(flagIcons).map(([lang, icon]) => (
        <button
          key={lang}
          className={`flag-button ${i18n.language === lang ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage(lang)}
          aria-label={`Change language to ${lang}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;