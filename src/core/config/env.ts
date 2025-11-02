// src/core/config/env.ts
import { z } from "zod";
import { logger } from "../utils/logger";

/**
 * @fileoverview Configuración y validación de variables de entorno.
 * @module core/config/env
 */
const envSchema = z
	.object({
		DATABASE_URL: z.string().optional(),
		DEVELOPMENT_DATABASE_URL: z.string().optional(),
		JWT_SECRET: z.string().min(1, { message: "JWT_SECRET es requerida." }),
		PORT: z.string().optional().default("4000"),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	})
	.refine(
		(env) => {
			if (env.NODE_ENV === "development") {
				return !!env.DEVELOPMENT_DATABASE_URL;
			}
			return !!env.DATABASE_URL;
		},
		{
			message:
				"La variable de base de datos apropiada (DATABASE_URL o DEVELOPMENT_DATABASE_URL) no está configurada para el NODE_ENV actual.",
			path: ["DATABASE_URL", "DEVELOPMENT_DATABASE_URL"],
		},
	);

try {
	envSchema.parse(process.env);
	logger.info("Variables de entorno validadas correctamente.");
} catch (error) {
	if (error instanceof z.ZodError) {
		logger.fatal(
			new Error(`❌ Variables de entorno inválidas: ${JSON.stringify(error.flatten().fieldErrors, null, 2)}`),
		);
	} else {
		logger.fatal(new Error(`❌ Error inesperado validando variables de entorno: ${error}`));
	}
	process.exit(1);
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}
