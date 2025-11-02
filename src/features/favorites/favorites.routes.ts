// src/features/favorites/favorites.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { FavoritesService } from "./favorites.service";
import { addFavoriteSchema, favoriteIdSchema } from "./favorites.validation";
import { jwtAuthMiddleware, getUserFromContext } from "../auth/auth.middleware";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../core/utils/constants";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError } from "../../core/utils/errors";

const favoritesService = new FavoritesService();
export const favoritesRoutes = new Hono();

// Aplicamos el middleware de autenticación a TODAS las rutas de favoritos
favoritesRoutes.use("*", jwtAuthMiddleware, getUserFromContext);

// --- Definición de Rutas ---

/**
 * @route GET /
 * @description Obtiene todos los favoritos del usuario.
 */
favoritesRoutes.get(
	"/",
	async (c) => {
		// Lógica del "getFavorites" controller
		const user = c.get("user");
		const userFavorites = await favoritesService.getFavoritesByUserId(user.id);

		return c.json({
			message: SUCCESS_MESSAGES.FAVORITES_FETCHED,
			data: userFavorites,
		});
	},
);

/**
 * @route POST /
 * @description Añade un nuevo Pokémon a favoritos.
 */
favoritesRoutes.post(
	"/",
	zValidator("json", addFavoriteSchema), // Valida el body
	async (c) => {
		// Lógica del "addFavorite" controller
		const user = c.get("user");
		const { pokemonId } = c.req.valid("json");

		const newFavorite = await favoritesService.addFavorite(user.id, pokemonId);
		logger.success(`Nuevo favorito añadido para User ID: ${user.id}`);

		return c.json(
			{
				message: SUCCESS_MESSAGES.FAVORITE_ADDED,
				data: newFavorite,
			},
			201,
		);
	},
);

/**
 * @route DELETE /:id
 * @description Elimina un favorito por su ID de entrada.
 */
favoritesRoutes.delete(
	"/:id",
	zValidator("param", favoriteIdSchema), // Valida el param de URL
	async (c) => {
		// Lógica del "removeFavoriteById" controller
		const user = c.get("user");
		const { id: favoriteEntryId } = c.req.valid("param");

		// 1. Verificar si la entrada de favorito existe
		const favoriteEntry = await favoritesService.findFavoriteByEntryId(favoriteEntryId);
		if (!favoriteEntry) {
			throw new NotFoundError(ERROR_MESSAGES.FAVORITE_NOT_FOUND);
		}

		// 2. Verificar propiedad (¡MUY IMPORTANTE!)
		if (favoriteEntry.userId !== user.id) {
			throw new UnauthorizedError("No tienes permiso para eliminar este favorito.");
		}

		// 3. Si todo es correcto, proceder con la eliminación
		await favoritesService.removeFavoriteById(favoriteEntryId);
		logger.success(`Favorito (Entrada ID: ${favoriteEntryId}) eliminado por User ID: ${user.id}`);

		return c.json({
			message: SUCCESS_MESSAGES.FAVORITE_REMOVED,
		});
	},
);