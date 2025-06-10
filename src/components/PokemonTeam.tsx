import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useTeams } from '../context/TeamContext';
import './PokemonTeam.css';

interface Pokemon {
  id: number;
  name: string;
  nickname?: string;
  spriteUrl?: string;
  pokedexNumber?: number;
}

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
  team: (Pokemon | null)[];
  onTeamUpdate: (team: (Pokemon | null)[]) => void;
}

const PokemonTeam: React.FC<PokemonTeamProps> = ({ team, onTeamUpdate }) => {
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
        
        // Initialize team with 3 null slots if empty
        if (team.length !== 3) {
          onTeamUpdate(Array(3).fill(null));
        }
      } catch (error) {
        console.error('Error cargando lista de Pokemon:', error);
      }
    };
    fetchPokemonList();
  }, []);

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

  const addPokemon = useCallback((index: number, pokemonData: PokemonApiResponse) => {
    const newTeam = [...team];
    newTeam[index] = {
      id: Date.now(),
      name: pokemonData.name,
      nickname: '',
      spriteUrl: pokemonData.sprites.front_default,
      pokedexNumber: pokemonData.id
    };
    onTeamUpdate(newTeam);
  }, [team, onTeamUpdate]);

  // Función para seleccionar una sugerencia
  const handleSelectSuggestion = useCallback(async (pokemonName: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (response.ok) {
        const data: PokemonApiResponse = await response.json();
        if (selectedSlot !== null) {
          addPokemon(selectedSlot, data);
          setSelectedSlot(null);
          setSearchTerm('');
          setSuggestions([]);
        }
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

  const updatePokemon = (index: number, updates: Partial<Pokemon>) => {
    if (team[index]) {
      const newTeam = [...team];
      newTeam[index] = { ...team[index], ...updates } as Pokemon;
      onTeamUpdate(newTeam);
    }
  };

  const handleSaveTeam = () => {
    if (teamName.trim() && team.some(pokemon => pokemon !== null)) {
      addTeam(teamName, team); // Ahora pasamos el equipo completo
      setTeamName('');
      setShowSaveDialog(false);
    }
  };

  const handleNewTeam = () => {
    // Limpiar el equipo actual
    onTeamUpdate(Array(3).fill(null));
    // Cerrar cualquier diálogo abierto
    setShowSaveDialog(false);
    setSelectedSlot(null);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="pokemon-team">
      <div className="team-header">
        <h2>Mi Equipo Pokemon</h2>
        <div className="team-buttons">
          <button 
            className="new-team-button"
            onClick={handleNewTeam}
          >
            Nuevo Equipo
          </button>
          <button 
            className="save-team-button"
            onClick={() => setShowSaveDialog(true)}
            disabled={!team.some(pokemon => pokemon !== null)}
          >
            Guardar Equipo
          </button>
        </div>
      </div>

      <div className="team-grid">
        {team.map((pokemon, index) => (
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
                  <input
                    type="text"
                    value={pokemon.nickname || ''}
                    onChange={(e) => updatePokemon(index, { nickname: e.target.value })}
                    placeholder="Apodo"
                    className="nickname-input"
                  />
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
                placeholder="Buscar Pokemon"
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
    </div>
  );
};

export default PokemonTeam;