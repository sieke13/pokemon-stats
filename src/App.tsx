import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import { TeamProvider } from './context/TeamContext';
import Teams from './pages/Teams';
import Home from './pages/Home';

interface StoredData {
  victories: number;
  defeats: number;
  playedDates: string[];
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('header.title');
  }, [t, i18n.language]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [victories, setVictories] = useState(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored ? JSON.parse(stored).victories : 0;
  });
  
  const [defeats, setDefeats] = useState(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored ? JSON.parse(stored).defeats : 0;
  });
  
  const [playedDates, setPlayedDates] = useState<Date[]>(() => {
    const stored = localStorage.getItem('pokemonStats');
    return stored 
      ? JSON.parse(stored).playedDates.map((date: string) => new Date(date))
      : [];
  });

  useEffect(() => {
    const data: StoredData = {
      victories,
      defeats,
      playedDates: playedDates.map(date => date.toISOString()),
    };
    localStorage.setItem('pokemonStats', JSON.stringify(data));
  }, [victories, defeats, playedDates]);

  const totalBattles = victories + defeats;
  const winPercentage = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;

  const handleDateToggle = (date: Date) => {
    setPlayedDates(prevDates => {
      const isDatePlayed = prevDates.some(playedDate => 
        playedDate.getDate() === date.getDate() &&
        playedDate.getMonth() === date.getMonth() &&
        playedDate.getFullYear() === date.getFullYear()
      );

      if (isDatePlayed) {
        return prevDates.filter(playedDate => 
          playedDate.getDate() !== date.getDate() ||
          playedDate.getMonth() !== date.getMonth() ||
          playedDate.getFullYear() !== date.getFullYear()
        );
      } else {
        return [...prevDates, date];
      }
    });
  };

  const handleReset = () => {
    setVictories(0);
    setDefeats(0);
    setPlayedDates([]);
    localStorage.removeItem('pokemonStats');
  };

  const handleVictory = () => {
    setVictories((prev: number) => prev + 1);
  };

  const handleDefeat = () => {
    setDefeats((prev: number) => prev + 1);
  };

  const handleVictoryRemove = () => {
    setVictories((prev: number) => Math.max(0, prev - 1));
  };

  const handleDefeatRemove = () => {
    setDefeats((prev: number) => Math.max(0, prev - 1));
  };

  const handleManualUpdate = (type: 'victories' | 'defeats', value: number) => {
    if (type === 'victories') {
      setVictories(value);
    } else {
      setDefeats(value);
    }
  };

  return (
    <TeamProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={
                <Home 
                  victories={victories}
                  defeats={defeats}
                  winPercentage={winPercentage}
                  playedDates={playedDates}
                  onDateToggle={handleDateToggle}
                  incrementVictories={handleVictory}
                  incrementDefeats={handleDefeat}
                  decrementVictories={handleVictoryRemove}
                  decrementDefeats={handleDefeatRemove}
                  handleReset={handleReset}
                  onManualUpdate={handleManualUpdate}
                />
              } />
              <Route path="/teams" element={<Teams />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TeamProvider>
  );
};

export default App;