declare global {
  interface BasePokemon {
    id: number;
    name: string;
    sprites: {
      front_default: string;
    };
    types: Array<{
      type: {
        name: string;
      };
    }>;
  }

  type Team = (BasePokemon | null)[];
}

export {};