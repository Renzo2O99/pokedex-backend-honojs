// src/features/custom-lists/custom-lists.types.ts

/**
 * @interface CustomList
 * @description Define la forma de un objeto de lista personalizada.
 */
export interface CustomList {
	id: number;
	userId: number;
	name: string;
	createdAt: Date;
}

/**
 * @interface CustomListWithPokemons
 * @description Define la forma de un objeto de lista personalizada que incluye los Pokémon asociados.
 */
export interface CustomListWithPokemons extends CustomList {
	pokemons: Array<{ pokemonId: number }>;
}

/**
 * @interface CustomListPokemon
 * @description Define la forma de un objeto de entrada de Pokémon en una lista personalizada.
 */
export interface CustomListPokemon {
	id: number;
	listId: number;
	pokemonId: number;
}
