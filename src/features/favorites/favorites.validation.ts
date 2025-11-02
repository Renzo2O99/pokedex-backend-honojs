// src/features/favorites/favorites.validation.ts
import { z } from "zod";
import { ERROR_MESSAGES } from "../../core/utils/constants";

// Valida el body para POST /favorites
export const addFavoriteSchema = z.object({
	pokemonId: z
		.number({ error: () => ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED })
		.int()
		.min(1, { message: ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED }),
});

// Valida el param para DELETE /favorites/:id
export const favoriteIdSchema = z.object({
	// Usamos "coerce" (forzar) porque los parámetros de URL
	// siempre llegan como strings, y queremos un número.
	id: z.coerce
		.number({ error: () => "El ID del favorito es requerido." })
		.int()
		.min(1, { message: "El ID del favorito debe ser un número válido." }),
});
