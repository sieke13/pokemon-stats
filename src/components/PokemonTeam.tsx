import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useTeams } from '../context/TeamContext';
import { useTranslation } from 'react-i18next';
import './PokemonTeam.css';
import { PokemonDisplay } from '../types/pokemon';

interface PokemonApiResponse {
  name: string;
  id: number;
  sprites: {
    front_default: string;
  };
}

interface PokemonListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonTeamProps {
  team: (PokemonDisplay | null)[];
  onTeamUpdate: (team: (PokemonDisplay | null)[]) => void;
}

const PokemonTeam: React.FC<PokemonTeamProps> = ({ team, onTeamUpdate }) => {
  const { t } = useTranslation();
  const { addTeam } = useTeams();
  const [teamName, setTeamName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pokemonList, setPokemonList] = useState<string[]>([]);

  // Cargar la lista de Pokemon al inicio
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
        const data: PokemonListResponse = await response.json();
        setPokemonList(data.results.map(pokemon => pokemon.name));
        
        // Only initialize if team is empty or undefined - don't override existing team
        if (!team || team.length === 0) {
          onTeamUpdate(Array(3).fill(null));
        }
      } catch (error) {
        console.error('Error cargando lista de Pokemon:', error);
      }
    };
    fetchPokemonList();
  }, []); // Remove team from dependencies to prevent overriding

  // Función para manejar la búsqueda y sugerencias
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

  // Update the addPokemon function to ensure proper team structure
  const addPokemon = useCallback((index: number, pokemonData: PokemonApiResponse) => {
    // Ensure we have a proper team array
    const currentTeam = team && Array.isArray(team) ? [...team] : Array(3).fill(null);
    
    // Ensure the team has at least the required slots
    while (currentTeam.length <= index) {
      currentTeam.push(null);
    }
    
    currentTeam[index] = {
      id: pokemonData.id,
      name: pokemonData.name,
      spriteUrl: pokemonData.sprites.front_default,
      pokedexNumber: pokemonData.id
    };
    
    console.log('Adding Pokemon:', pokemonData.name, 'to slot:', index); // Debug log
    onTeamUpdate(currentTeam);
  }, [team, onTeamUpdate]);

  // Función para seleccionar una sugerencia
  const handleSelectSuggestion = useCallback(async (pokemonName: string) => {
    console.log('Selecting Pokemon:', pokemonName, 'for slot:', selectedSlot); // Debug log
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (response.ok) {
        const data: PokemonApiResponse = await response.json();
        console.log('Pokemon data received:', data); // Debug log
        
        if (selectedSlot !== null) {
          addPokemon(selectedSlot, data);
          setSelectedSlot(null);
          setSearchTerm('');
          setSuggestions([]);
        }
      } else {
        console.error('Pokemon not found:', pokemonName);
      }
    } catch (error) {
      console.error('Error al obtener Pokemon:', error);
    }
  }, [selectedSlot, addPokemon]);

  const removePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    onTeamUpdate(newTeam);
  };

  const handleSaveTeam = () => {
    if (window.confirm(t('teamActions.confirmSave'))) {
      addTeam(teamName); // Solo pasamos el nombre
      setTeamName('');
      setShowSaveDialog(false);
      alert(t('teamActions.teamSaved'));
    }
  };

  const handleNewTeam = () => {
    if (window.confirm(t('teamActions.confirmNew'))) {
      // Limpiar el equipo actual
      onTeamUpdate(Array(3).fill(null));
      // Cerrar cualquier diálogo abierto
      setShowSaveDialog(false);
      setSelectedSlot(null);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  // Update the team grid to handle undefined team
  const safeTeam = team && Array.isArray(team) ? team : Array(3).fill(null);

  return (
    <div className="pokemon-team">
      <div className="team-header">
        <h2>{t('team.title')}</h2>
        <div className="team-buttons">
          <button className="team-button new" onClick={handleNewTeam}>
            {t('teamButtons.newTeam')}
          </button>
          <button 
            className="save-team-button"
            onClick={() => setShowSaveDialog(true)}
            disabled={!team.some(pokemon => pokemon !== null)}
          >
            {t('teamButtons.saveTeam')}
          </button>
        </div>
      </div>

      <div className="team-grid">
        {safeTeam.map((pokemon, index) => (
          <div key={index} className="pokemon-slot">
            {pokemon ? (
              <div className="pokemon-card">
                {pokemon.spriteUrl && (
                  <img 
                    src={pokemon.spriteUrl} 
                    alt={pokemon.name} 
                    className="pokemon-sprite"
                  />
                )}
                <div className="pokemon-info">
                  <span className="pokemon-number">#{pokemon.pokedexNumber}</span>
                  <span className="pokemon-name">{pokemon.name}</span>
                </div>
                <button 
                  className="remove-pokemon"
                  onClick={() => removePokemon(index)}
                >
                  ×
                </button>
              </div>
            ) : (
              <button 
                className="add-pokemon" 
                onClick={() => setSelectedSlot(index)}
              >
                <AiOutlinePlus size={16} />
                Añadir Pokemon
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedSlot !== null && (
        <div className="pokemon-search">
          <div className="search-container">
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('team.searchPlaceholder')}
                className="search-input"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <h3>Guardar Equipo</h3>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nombre del equipo"
              className="team-name-input"
            />
            <div className="dialog-buttons">
              <button 
                className="save-button"
                onClick={handleSaveTeam}
                disabled={!teamName.trim()}
              >
                Guardar
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowSaveDialog(false);
                  setTeamName('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {team.length === 0 && (
        <p className="empty-team">{t('team.emptyTeam')}</p>
      )}
      {team.length >= 6 && (
        <p className="team-error">{t('team.maxTeamSize')}</p>
      )}
    </div>
  );
};

export default PokemonTeam;