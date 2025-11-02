// src/core/middlewares/auth.middleware.ts
import "dotenv/config";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import { ERROR_MESSAGES } from "../../core/utils/constants";
import { logger } from "../../core/utils/logger";
import { UnauthorizedError } from "../../core/utils/errors";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	logger.fatal(new Error("JWT_SECRET no está definido"));
	throw new Error("JWT_SECRET no está definido");
}

export interface JwtPayload {
	id: number;
	username: string;
}

type Env = {
	Variables: {
		user: JwtPayload;
	};
};

export const jwtAuthMiddleware = jwt({
	secret: JWT_SECRET,
	// Puedes añadir opciones de verificación adicionales aquí, como el 'aud' (audience)
	// verification: {
	//     aud: 'mi-app-audience'
	// }
});

export const getUserFromContext = createMiddleware<Env>(async (c, next) => {
	try {
		const payload = c.get("jwtPayload");

		if (!payload || typeof payload !== "object" || !("id" in payload) || !("username" in payload)) {
			logger.error(`Token válido, pero payload inesperado o incompleto: ${JSON.stringify(payload)}`);
			throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_PAYLOAD_INVALID);
		}

		c.set("user", payload as JwtPayload);

		logger.info(`Usuario autenticado: ${payload.username} (ID: ${payload.id}) para ${c.req.method} ${c.req.path}`);
		await next();
	} catch (error) {
		logger.error(`Error procesando el payload de JWT: ${(error as Error).message}`);
		throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
	}
});
