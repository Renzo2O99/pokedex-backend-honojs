// src/features/custom-lists/custom-lists.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { CustomListsService } from "./custom-lists.service";
import {
	listBodySchema,
	listIdParamSchema,
	pokemonBodySchema,
	listAndPokemonIdParamsSchema,
} from "./custom-lists.validation";
import { jwtAuthMiddleware, getUserFromContext } from "../auth/auth.middleware";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../core/utils/constants";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError, ConflictError } from "../../core/utils/errors";
import type { CustomList } from "./custom-lists.types";

const listService = new CustomListsService();
export const customListsRoutes = new Hono();

// --- Middleware de Seguridad ---
// Protegemos todas las rutas de listas personalizadas
customListsRoutes.use("*", jwtAuthMiddleware, getUserFromContext);

// --- Helper de Verificación de Propiedad ---
const checkOwnership = async (userId: number, listId: number): Promise<CustomList> => {
	const list = await listService.getListById(listId);
	if (!list) {
		throw new NotFoundError(ERROR_MESSAGES.LIST_NOT_FOUND);
	}
	if (list.userId !== userId) {
		logger.warn(`Intento no autorizado. Usuario ${userId} intentó acceder a lista ${listId} de usuario ${list.userId}`);
		throw new UnauthorizedError(ERROR_MESSAGES.LIST_FORBIDDEN);
	}
	return list;
};

// --- Definición de Rutas (CRUD de Listas) ---

/**
 * @route GET /
 * @description Obtiene todas las listas del usuario.
 */
customListsRoutes.get("/", async (c) => {
	const user = c.get("user");
	const lists = await listService.getListsByUserId(user.id);
	return c.json({
		message: SUCCESS_MESSAGES.LISTS_FETCHED,
		data: lists,
	});
});

/**
 * @route POST /
 * @description Crea una nueva lista.
 */
customListsRoutes.post(
	"/",
	zValidator("json", listBodySchema),
	async (c) => {
		const user = c.get("user");
		const { name } = c.req.valid("json");

		const newList = await listService.createList(user.id, name);
		logger.success(`Nueva lista creada (ID: ${newList.id}) por User ID: ${user.id}`);

		return c.json(
			{
				message: SUCCESS_MESSAGES.LIST_CREATED,
				data: newList,
			},
			201,
		);
	},
);

/**
 * @route GET /:listId
 * @description Obtiene detalles de una lista (incluye Pokémon).
 */
customListsRoutes.get(
	"/:listId",
	zValidator("param", listIdParamSchema), 
	async (c) => {
		const user = c.get("user");
		const { listId } = c.req.valid("param");

		await checkOwnership(user.id, listId);

		const listDetails = await listService.getListWithPokemons(listId);
		return c.json({
			message: SUCCESS_MESSAGES.LIST_DETAILS_FETCHED,
			data: listDetails,
		});
	},
);

/**
 * @route PUT /:listId
 * @description Actualiza el nombre de una lista.
 */
customListsRoutes.put(
	"/:listId",
	zValidator("param", listIdParamSchema), 
	zValidator("json", listBodySchema),
	async (c) => {
		const user = c.get("user");
		const { listId } = c.req.valid("param");
		const { name } = c.req.valid("json");

		await checkOwnership(user.id, listId); // Verifica propiedad
		const updatedList = await listService.updateList(listId, name);

		return c.json({
			message: SUCCESS_MESSAGES.LIST_UPDATED,
			data: updatedList,
		});
	},
);

/**
 * @route DELETE /:listId
 * @description Elimina una lista.
 */
customListsRoutes.delete(
	"/:listId",
	zValidator("param", listIdParamSchema),
	async (c) => {
		const user = c.get("user");
		const { listId } = c.req.valid("param");

		await checkOwnership(user.id, listId);
		await listService.deleteList(listId);

		return c.json({
			message: SUCCESS_MESSAGES.LIST_DELETED,
		});
	},
);

// --- Definición de Rutas (CRUD de Pokémon en Listas) ---

/**
 * @route POST /:listId/pokemon
 * @description Añade un Pokémon a una lista.
 */
customListsRoutes.post(
	"/:listId/pokemon",
	zValidator("param", listIdParamSchema),
	zValidator("json", pokemonBodySchema),
	async (c) => {
		const user = c.get("user");
		const { listId } = c.req.valid("param");
		const { pokemonId } = c.req.valid("json");

		await checkOwnership(user.id, listId);

		const existingEntry = await listService.findPokemonInList(listId, pokemonId);
		if (existingEntry) {
			throw new ConflictError(ERROR_MESSAGES.POKEMON_ALREADY_IN_LIST);
		}

		const newEntry = await listService.addPokemonToList(listId, pokemonId);
		return c.json(
			{
				message: SUCCESS_MESSAGES.POKEMON_ADDED_TO_LIST,
				data: newEntry,
			},
			201,
		);
	},
);

/**
 * @route DELETE /:listId/pokemon/:pokemonId
 * @description Elimina un Pokémon de una lista.
 */
customListsRoutes.delete(
	"/:listId/pokemon/:pokemonId",
	zValidator("param", listAndPokemonIdParamsSchema), 
	async (c) => {
		const user = c.get("user");
		const { listId, pokemonId } = c.req.valid("param");

		await checkOwnership(user.id, listId);

		const existingEntry = await listService.findPokemonInList(listId, pokemonId);
		if (!existingEntry) {
			throw new NotFoundError(ERROR_MESSAGES.POKEMON_NOT_IN_LIST);
		}

		await listService.removePokemonFromList(listId, pokemonId);
		return c.json({
			message: SUCCESS_MESSAGES.POKEMON_REMOVED_FROM_LIST,
		});
	},
);
