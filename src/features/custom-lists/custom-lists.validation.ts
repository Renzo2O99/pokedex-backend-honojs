// src/features/custom-lists/custom-lists.validation.ts
import { z } from "zod";
import { ERROR_MESSAGES } from "../../core/utils/constants";

// Valida el body para: POST / y PUT /:listId
// Reemplaza 'validateCreateList' y 'validateUpdateList' (body)
export const listBodySchema = z.object({
	name: z.string().trim().min(1, { message: ERROR_MESSAGES.VALIDATION_LIST_NAME_REQUIRED }),
});

// Valida el param: /:listId
// Reemplaza 'validateListIdParam'
export const listIdParamSchema = z.object({
	listId: z.coerce
		.number({ error: () => "El ID de la lista debe ser un número." })
		.int()
		.min(1, { message: ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED }),
});

// Valida el body para: POST /:listId/pokemon
// Reemplaza 'validateAddPokemon' (body)
export const pokemonBodySchema = z.object({
	pokemonId: z.coerce
		.number({ error: () => ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED })
		.int()
		.min(1, { message: ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED }),
});

// Valida los params para: DELETE /:listId/pokemon/:pokemonId
// Reemplaza 'validateRemovePokemon'
export const listAndPokemonIdParamsSchema = z.object({
	listId: z.coerce
		.number({ error: () => "El ID de la lista debe ser un número." })
		.int()
		.min(1, { message: ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED }),
	pokemonId: z.coerce
		.number({ error: () => "El ID del Pokémon debe ser un número." })
		.int()
		.min(1, { message: ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED }),
});
