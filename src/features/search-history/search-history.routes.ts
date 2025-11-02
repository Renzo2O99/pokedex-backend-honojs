// src/features/search-history/search-history.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { SearchHistoryService } from "./search-history.service";
import { addTermSchema, historyIdParamSchema } from "./search-history.validation";
import { jwtAuthMiddleware, getUserFromContext } from "../auth/auth.middleware";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../core/utils/constants";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError } from "../../core/utils/errors";

const historyService = new SearchHistoryService();
export const historyRoutes = new Hono();

// --- Middleware de Seguridad ---
// Protegemos todas las rutas del historial
historyRoutes.use("*", jwtAuthMiddleware, getUserFromContext);

// --- Definición de Rutas ---

/**
 * @route GET /
 * @description Obtiene el historial de búsqueda del usuario.
 * (Lógica de 'getSearchHistory' controller)
 */
historyRoutes.get("/", async (c) => {
	const user = c.get("user");
	const history = await historyService.getHistoryByUserId(user.id);

	return c.json({
		message: SUCCESS_MESSAGES.HISTORY_FETCHED,
		data: history,
	});
});

/**
 * @route POST /
 * @description Añade un término de búsqueda (upsert).
 * (Lógica de 'addSearchTerm' controller)
 */
historyRoutes.post(
	"/",
	zValidator("json", addTermSchema),
	async (c) => {
		const user = c.get("user");
		const { searchTerm } = c.req.valid("json");

		// El servicio se encarga de la lógica de 'upsert' y de 'trimHistory'
		const newEntry = await historyService.addSearchTerm(user.id, searchTerm);
		logger.success(`Término de historial guardado para User ID: ${user.id}`);

		return c.json(
			{
				message: SUCCESS_MESSAGES.HISTORY_ENTRY_ADDED,
				data: newEntry,
			},
			201,
		);
	},
);

/**
 * @route DELETE /:id
 * @description Elimina una entrada del historial.
 * (Lógica de 'deleteSearchTerm' controller)
 */
historyRoutes.delete(
	"/:id",
	zValidator("param", historyIdParamSchema),
	async (c) => {
		const user = c.get("user");
		const { id: entryId } = c.req.valid("param");

		const entry = await historyService.findHistoryEntryById(entryId);
		if (!entry) {
			throw new NotFoundError(ERROR_MESSAGES.HISTORY_ENTRY_NOT_FOUND);
		}

		if (entry.userId !== user.id) {
			logger.warn(
				`Intento no autorizado de borrado. Usuario ${user.id} intentó borrar entrada ${entryId} de usuario ${entry.userId}`,
			);
			throw new UnauthorizedError(ERROR_MESSAGES.HISTORY_FORBIDDEN);
		}

		// 3. Proceder con la eliminación
		await historyService.removeSearchTerm(entryId);
		logger.success(`Entrada de historial ${entryId} eliminada por User ID: ${user.id}`);

		return c.json({
			message: SUCCESS_MESSAGES.HISTORY_ENTRY_REMOVED,
		});
	},
);
