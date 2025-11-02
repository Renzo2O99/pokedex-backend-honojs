// src/features/favorites/favorites.service.ts

/**
 * @fileoverview Servicio que maneja la lógica de negocio relacionada con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para gestionar las operaciones CRUD de favoritos en la base de datos.
 * @module features/favorites/favorites.service
 */

import { db } from "../../core/db";
import { favorites } from "../../core/db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../../core/utils/logger";
import type { Favorite } from "./favorites.types";
import { ConflictError, InternalServerError } from "../../core/utils/errors";
import { ERROR_MESSAGES } from "../../core/utils/constants";

/**
 * @class FavoritesService
 * @description Servicio que maneja la lógica de negocio relacionada con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para gestionar las operaciones CRUD de favoritos en la base de datos.
 */
export class FavoritesService {
	/**
	 * Obtiene todos los Pokémon favoritos de un usuario específico.
	 * @param {number} userId - ID del usuario del que se quieren obtener los favoritos.
	 * @returns {Promise<Favorite[]>} Promesa que resuelve a un array de objetos con los IDs de los Pokémon favoritos y la fecha de creación.
	 * @throws {InternalServerError} Si ocurre un error al consultar la base de datos.
	 */
	public async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
		logger.info(`Buscando favoritos para el usuario ID: ${userId}`);
		try {
			return await db.query.favorites.findMany({
				where: eq(favorites.userId, userId),
			});
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.error(`Error al obtener favoritos para el usuario ${userId}:`, errorMessage);
			throw new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Busca un Pokémon específico en los favoritos de un usuario.
	 * @param {number} userId - ID del usuario.
	 * @param {number} pokemonId - ID del Pokémon a buscar en favoritos.
	 * @returns {Promise<Favorite | undefined>}
	 *          Promesa que resuelve al registro de favorito si existe, o undefined si no se encuentra.
	 * @throws {InternalServerError} Si ocurre un error al consultar la base de datos.
	 */
	public async findFavoriteById(userId: number, pokemonId: number): Promise<Favorite | undefined> {
		try {
			return await db.query.favorites.findFirst({
				where: and(eq(favorites.userId, userId), eq(favorites.pokemonId, pokemonId)),
			});
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.error(`Error al buscar el favorito (User: ${userId}, Pokemon: ${pokemonId}):`, errorMessage);
			throw new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Busca una entrada de favorito por su ID de entrada único (clave primaria).
	 * @param {number} favoriteEntryId - El ID de la entrada de favorito.
	 * @returns {Promise<Favorite | undefined>} El favorito encontrado o undefined.
	 * @throws {InternalServerError} Si ocurre un error en la base de datos.
	 */
	public async findFavoriteByEntryId(favoriteEntryId: number): Promise<Favorite | undefined> {
		try {
			return await db.query.favorites.findFirst({
				where: eq(favorites.id, favoriteEntryId),
			});
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.error(`Error al buscar el favorito con ID de entrada ${favoriteEntryId}:`, errorMessage);
			throw new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Añade un nuevo Pokémon a la lista de favoritos de un usuario.
	 * @param {number} userId - ID del usuario que está añadiendo el favorito.
	 * @param {number} pokemonId - ID del Pokémon que se va a añadir a favoritos.
	 * @returns {Promise<Favorite>}
	 *          Promesa que resuelve al registro del nuevo favorito creado.
	 * @throws {ConflictError} Si el Pokémon ya está en la lista de favoritos del usuario.
	 * @throws {InternalServerError} Si ocurre un error al insertar en la base de datos.
	 */
	public async addFavorite(userId: number, pokemonId: number): Promise<Favorite> {
		// Verificar si el favorito ya existe
		const existing = await this.findFavoriteById(userId, pokemonId);

		if (existing) {
			throw new ConflictError(ERROR_MESSAGES.FAVORITE_ALREADY_EXISTS);
		}

		logger.info(`Añadiendo favorito (User: ${userId}, Pokemon: ${pokemonId})`);
		try {
			const newFavorite = await db
				.insert(favorites)
				.values({
					userId: userId,
					pokemonId: pokemonId,
				})
				.returning({
					id: favorites.id,
					userId: favorites.userId,
					pokemonId: favorites.pokemonId,
					createdAt: favorites.createdAt,
				});

			return newFavorite[0];
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.error(`Error al añadir favorito (User: ${userId}, Pokemon: ${pokemonId}):`, errorMessage);
			throw new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Elimina un Pokémon de la lista de favoritos de un usuario.
	 * @param {number} userId - ID del usuario que está eliminando el favorito.
	 * @param {number} pokemonId - ID del Pokémon que se va a eliminar de favoritos.
	 * @returns {Promise<Favorite | undefined>}
	 *          Promesa que resuelve al registro del favorito eliminado, o undefined si no existía.
	 * @throws {InternalServerError} Si ocurre un error al eliminar de la base de datos.
	 */
	public async removeFavoriteById(favoriteEntryId: number) {
		logger.info(`Eliminando favorito por ID de entrada: ${favoriteEntryId}`);
		try {
			const removedFavorite = await db.delete(favorites).where(eq(favorites.id, favoriteEntryId)).returning();
			return removedFavorite[0];
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.error(`Error al eliminar el favorito con ID de entrada ${favoriteEntryId}:`, errorMessage);
			throw new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
		}
	}
}
