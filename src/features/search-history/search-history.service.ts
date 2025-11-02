// src/features/search-history/search-history.service.ts

/**
 * @fileoverview Servicio que maneja la lógica de negocio relacionada con el historial de búsqueda de los usuarios.
 * Proporciona métodos para gestionar las operaciones CRUD del historial en la base de datos, incluyendo limpieza.
 * @module features/search-history/search-history.service
 */

import { db } from "../../core/db";
import { searchHistory } from "../../core/db/schema";
import { and, desc, eq, notInArray } from "drizzle-orm";
import { logger } from "../../core/utils/logger";
import type { SearchHistoryEntry } from "./search-history.types";

/**
 * @constant {number} HISTORY_LIMIT - El número máximo de entradas de historial a mantener por usuario.
 */
const HISTORY_LIMIT = 25;

/**
 * @class SearchHistoryService
 * @description Servicio que maneja la lógica de negocio para el historial de búsqueda de los usuarios.
 * Incluye métodos para obtener, añadir, eliminar y limpiar entradas del historial.
 */
export class SearchHistoryService {
	/**
	 * Obtiene el historial de un usuario, limitado a las N entradas más recientes.
	 * @async
	 * @param {number} userId - ID del usuario cuyo historial se desea obtener.
	 * @returns {Promise<SearchHistoryEntry[]>}
	 *          Un array de entradas del historial de búsqueda.
	 */
	public async getHistoryByUserId(userId: number): Promise<SearchHistoryEntry[]> {
		logger.info(`Buscando historial para el usuario ID: ${userId}`);
		return db.query.searchHistory.findMany({
			where: eq(searchHistory.userId, userId),
			orderBy: [desc(searchHistory.createdAt)],
			limit: HISTORY_LIMIT,
		});
	}

	/**
	 * Añade un término de búsqueda. Si ya existe, actualiza su "createdAt" para mantenerlo relevante en la lista.
	 * @async
	 * @param {number} userId - ID del usuario que añade el término.
	 * @param {string} searchTerm - El término de búsqueda a añadir.
	 * @returns {Promise<SearchHistoryEntry>}
	 *          La entrada del historial creada o actualizada.
	 */
	public async addSearchTerm(userId: number, searchTerm: string): Promise<SearchHistoryEntry> {
		logger.info(`Guardando historial (User: ${userId}, Term: ${searchTerm})`);

		const newEntry = await db
			.insert(searchHistory)
			.values({
				userId: userId,
				searchTerm: searchTerm,
				createdAt: new Date(),
			})
			.onConflictDoUpdate({
				target: [searchHistory.userId, searchHistory.searchTerm],
				set: {
					createdAt: new Date(),
				},
			})
			.returning();

		this._trimHistory(userId).catch((err) => logger.error("Error limpiando historial", err));

		return newEntry[0];
	}

	/**
	 * Elimina una entrada de historial específica por su ID.
	 * @async
	 * @param {number} entryId - ID de la entrada del historial a eliminar.
	 * @returns {Promise<SearchHistoryEntry | undefined>}
	 *          La entrada eliminada, o undefined si no se encontró.
	 */
	public async removeSearchTerm(entryId: number): Promise<SearchHistoryEntry | undefined> {
		logger.info(`Eliminando entrada de historial ID: ${entryId}`);
		const removedEntry = await db.delete(searchHistory).where(eq(searchHistory.id, entryId)).returning();

		return removedEntry[0];
	}

	/**
	 * Busca una entrada de historial por su ID (para verificar propiedad antes de borrar).
	 * @async
	 * @param {number} entryId - ID de la entrada del historial a buscar.
	 * @returns {Promise<SearchHistoryEntry | undefined>}
	 *          La entrada encontrada, o undefined si no existe.
	 */
	public async findHistoryEntryById(entryId: number): Promise<SearchHistoryEntry | undefined> {
		return db.query.searchHistory.findFirst({
			where: eq(searchHistory.id, entryId),
		});
	}

	/**
	 * Rutina de limpieza. Se asegura de que el usuario no tenga más de N entradas.
	 * Elimina las entradas más antiguas que excedan el HISTORY_LIMIT.
	 * @private
	 * @async
	 * @param {number} userId - ID del usuario cuyo historial se va a limpiar.
	 * @returns {Promise<void>}
	 */
	private async _trimHistory(userId: number): Promise<void> {
		try {
			const recentEntries = await db
				.select({ id: searchHistory.id })
				.from(searchHistory)
				.where(eq(searchHistory.userId, userId))
				.orderBy(desc(searchHistory.createdAt))
				.limit(HISTORY_LIMIT);

			if (recentEntries.length < HISTORY_LIMIT) {
				return;
			}

			const idsToKeep = recentEntries.map((e) => e.id);

			const deleted = await db
				.delete(searchHistory)
				.where(and(eq(searchHistory.userId, userId), notInArray(searchHistory.id, idsToKeep)))
				.returning({ id: searchHistory.id });

			if (deleted.length > 0) {
				logger.info(`Limpiadas ${deleted.length} entradas antiguas de historial para User ID: ${userId}`);
			}
		} catch (error) {
			logger.error(`Error no fatal durante _trimHistory para User ID: ${userId}`, error);
		}
	}
}
