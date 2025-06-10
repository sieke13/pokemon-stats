import React, { useState, useEffect, useCallback } from 'react';
import { useTeams } from '../context/TeamContext';
import './TeamManager.css';

interface PokemonApiResponse {
  name: string;
  id: number;
  sprites: {
    front_default: string;
  };
}

const TeamManager: React.FC = () => {
  const { teams, currentTeam, deleteTeam, setCurrentTeam, updateTeam } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pokemonList, setPokemonList] = useState<string[]>([]);

  // Cargar la lista de Pokemon
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
        const data = await response.json();
        setPokemonList(data.results.map((pokemon: { name: string }) => pokemon.name));
      } catch (error) {
        console.error('Error cargando lista de Pokemon:', error);
      }
    };
    fetchPokemonList();
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matchingSuggestions = pokemonList
      .filter(name => name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    setSuggestions(matchingSuggestions);
  }, [pokemonList]);

  const handleSelectPokemon = async (pokemonName: string) => {
    if (selectedTeamId && selectedSlotIndex !== null) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data: PokemonApiResponse = await response.json();
        
        const selectedTeam = teams.find(t => t.id === selectedTeamId);
        if (selectedTeam) {
          const newPokemon = {
            id: Date.now(),
            name: data.name,
            nickname: '',
            spriteUrl: data.sprites.front_default,
            pokedexNumber: data.id
          };
          
          const newTeamPokemon = [...selectedTeam.pokemon];
          newTeamPokemon[selectedSlotIndex] = newPokemon;
          updateTeam(selectedTeamId, newTeamPokemon);
        }
        
        setShowSearchDialog(false);
        setSearchTerm('');
        setSuggestions([]);
      } catch (error) {
        console.error('Error al obtener Pokemon:', error);
      }
    }
  };

  const handlePokemonClick = (teamId: string, index: number) => {
    setSelectedTeamId(teamId);
    setSelectedSlotIndex(index);
    setShowSearchDialog(true);
  };

  return (
    <div className="team-manager">
      <h2>Mis Equipos Pokemon</h2>
      <div className="teams-list">
        {teams.map(team => (
          <div key={team.id} className={`team-item ${currentTeam?.id === team.id ? 'active' : ''}`}>
            <div className="team-content">
              <div className="team-info">
                <h3>{team.name}</h3>
                <span className="pokemon-count">
                  {team.pokemon.filter(Boolean).length}/3 Pokemon
                </span>
              </div>
              
              <div className="team-pokemon">
                {team.pokemon.map((pokemon, index) => (
                  <div 
                    key={index} 
                    className={`team-pokemon-card ${!pokemon ? 'empty' : ''}`}
                    onClick={() => handlePokemonClick(team.id, index)}
                  >
                    {pokemon ? (
                      <>
                        <div className="pokemon-edit-overlay">
                          <span className="edit-icon">✏️</span>
                        </div>
                        <img 
                          src={pokemon.spriteUrl} 
                          alt={pokemon.name}
                          className="pokemon-sprite"
                        />
                        <div className="pokemon-info">
                          <span className="pokemon-name">{pokemon.name}</span>
                          {pokemon.nickname && (
                            <span className="pokemon-nickname">({pokemon.nickname})</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="empty-slot-text">Vacío</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="team-actions">
                <button 
                  onClick={() => setCurrentTeam(team.id)}
                  className="select-team-button"
                >
                  Seleccionar
                </button>
                <button 
                  onClick={() => deleteTeam(team.id)}
                  className="delete-team-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSearchDialog && (
        <div className="search-dialog-overlay">
          <div className="search-container">
            <h3>Seleccionar Pokemon</h3>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar Pokemon..."
                className="search-input"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setSuggestions([]);
                      }}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="dialog-buttons">
              <button 
                className="accept-button"
                onClick={() => handleSelectPokemon(searchTerm)}
                disabled={!searchTerm.trim()}
              >
                Aceptar
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowSearchDialog(false);
                  setSearchTerm('');
                  setSuggestions([]);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;