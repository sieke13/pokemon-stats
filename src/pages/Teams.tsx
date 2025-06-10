import React from 'react';
import TeamManager from '../components/TeamManager';

const Teams: React.FC = () => {
  return (
    <div className="teams-page">
      <h1>Equipos Pokemon</h1>
      <TeamManager />
    </div>
  );
};

export default Teams;