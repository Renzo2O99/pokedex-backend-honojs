// src/index.ts
import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger as honoLogger } from "hono/logger";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "./core/utils/response";

import { authRoutes } from "./features/auth/auth.routes";
import { logger } from "./core/utils/logger";
import { GeneralError } from "./core/utils/errors";
import { ENVIRONMENT_MESSAGES } from "./core/utils/constants";

const app = new Hono().basePath("/api");

// --------------------------------------------------
// MIDDLEWARES GLOBALES (Aplicados a todas las rutas)
// --------------------------------------------------
app.use(
	"*",
	cors({
		origin: "http://localhost:3000",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	}),
);

app.use("*", secureHeaders());

app.use(
	"*",
	honoLogger((message) => logger.info(message)),
);

// --------------------------------------------------
// RUTAS
// --------------------------------------------------
app.get("/", (c) => c.json({ message: "¡El backend de Hono está funcionando!" }));
app.route("/auth", authRoutes);

// --------------------------------------------------
// MANEJADOR DE ERRORES GLOBAL
// --------------------------------------------------
app.onError((err, c) => {
	if (err instanceof ZodError) {
		logger.warn(`Error de validación: ${err.message}`);
		return sendResponse(
			c,
			{
				status: "error",
				message: "Datos de entrada inválidos",
				errors: err.flatten().fieldErrors,
			},
			StatusCodes.BAD_REQUEST,
		);
	}

	if (err instanceof GeneralError) {
		logger.warn(`Error controlado [${err.statusCode}]: ${err.message}`);
		const statusCode = Object.values(StatusCodes).includes(err.statusCode)
			? err.statusCode
			: StatusCodes.INTERNAL_SERVER_ERROR;

		return sendResponse(
			c,
			{
				status: "error",
				message: err.message,
			},
			statusCode,
		);
	}

	logger.error(`Error no controlado:`, err);
	return sendResponse(
		c,
		{
			status: "error",
			message: "Error interno del servidor.",
		},
		StatusCodes.INTERNAL_SERVER_ERROR,
	);
});

// --------------------------------------------------
// INICIO DEL SERVIDOR
// --------------------------------------------------
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
serve({ fetch: app.fetch, port: port }, () => {
	if (process.env.NODE_ENV === "production") {
		logger.info(ENVIRONMENT_MESSAGES.PRODUCTION);
	} else {
		logger.info(ENVIRONMENT_MESSAGES.DEVELOPMENT);
	}
	logger.success(`\nBackend Hono escuchando en el puerto ${port} 🚀\n`);
});
