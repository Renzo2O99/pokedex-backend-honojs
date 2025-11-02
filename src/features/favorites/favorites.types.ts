// src/features/favorites/favorites.types.ts

/**
 * @interface Favorite
 * @description Define la forma de un objeto de favorito.
 */
export interface Favorite {
	id: number;
	userId: number;
	pokemonId: number;
	createdAt: Date;
}
