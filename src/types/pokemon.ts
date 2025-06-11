export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonDisplay {
  id: number;
  name: string;
  spriteUrl: string;
  pokedexNumber: number;
}

export type PokemonTeam = (Pokemon | null)[];