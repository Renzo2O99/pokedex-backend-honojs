// src/features/search-history/search-history.validation.ts
import { z } from "zod";
import { ERROR_MESSAGES } from "../../core/utils/constants";

// Valida el body para POST /
// Reemplaza a 'validateAddTerm'
export const addTermSchema = z.object({
	searchTerm: z.string().trim().min(1, { message: ERROR_MESSAGES.VALIDATION_SEARCH_TERM_REQUIRED }),
});

// Valida el param para DELETE /:id
// Reemplaza a 'validateDeleteTerm'
export const historyIdParamSchema = z.object({
	id: z.coerce
		.number({ error: () => "El ID debe ser un número." })
		.int({ message: "El ID debe ser un entero." })
		.min(1, { message: "El ID de la entrada debe ser un número válido." }),
});
