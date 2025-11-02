// src/features/auth/auth.routes.ts
import { type Context, Hono } from "hono";
import bcrypt from "bcryptjs";
import { zValidator } from "@hono/zod-validator";

import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, changePasswordSchema } from "./auth.validation";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/utils/constants";
import { logger } from "../../core/utils/logger";
import { UnauthorizedError } from "../../core/utils/errors";
import { rateLimiter } from "hono-rate-limiter";
import { getUserFromContext, jwtAuthMiddleware } from "./auth.middleware";

const authService = new AuthService();
export const authRoutes = new Hono();

const limiter = rateLimiter({
	windowMs: 60 * 1000,
	limit: 10,
	message: {
		status: "error",
		message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
	},
	keyGenerator: (c: Context) => {
		// Use the IP address from the X-Forwarded-For header if behind a proxy, or the remote address
		const ip =
			c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || c.req.header("x-real-ip") || "unknown";
		return ip;
	},
});

// --- Rutas Públicas ---

/**
 * @route POST /register
 */
authRoutes.post("/register", limiter, zValidator("json", registerSchema), async (c) => {
	const { username, email, password } = c.req.valid("json");

	const newUser = await authService.register(username, email, password);
	logger.success(`Usuario registrado: ${newUser.username} (ID: ${newUser.id})`);

	return c.json(
		{
			message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
			user: newUser,
		},
		201,
	);
});

/**
 * @route POST /login
 */
authRoutes.post("/login", limiter, zValidator("json", loginSchema), async (c) => {
	const { email, password } = c.req.valid("json");
	logger.info(`Intento de login para: ${email}`);

	try {
		const result = await authService.login(email, password);
		logger.success(`Login exitoso para: ${result.user.email} (ID: ${result.user.id})`);
		return c.json({
			message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
			data: result,
		});
	} catch (error) {
		if (
			error instanceof Error &&
			(error.message === ERROR_MESSAGES.USER_NOT_FOUND || error.message === ERROR_MESSAGES.PASSWORD_INCORRECT)
		) {
			logger.error(`\nLogin fallido para: ${email} - Credenciales inválidas`);
			throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
		}
		throw error;
	}
});

// --- Rutas Privadas (¡AHORA SÍ LAS INCLUYO!) ---

/**
 * @route GET /me
 */
authRoutes.get("/me", jwtAuthMiddleware, getUserFromContext, async (c) => {
	const userPayload = c.get("user");
	const user = await authService.findUserById(userPayload.id);
	if (!user) {
		throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
	}

	return c.json({
		message: SUCCESS_MESSAGES.PROFILE_FETCHED,
		data: {
			id: user.id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt,
		},
	});
});

/**
 * @route PUT /password
 */
authRoutes.put(
	"/password",
	jwtAuthMiddleware,
	getUserFromContext,
	zValidator("json", changePasswordSchema),
	async (c) => {
		// La lógica de tu "changeUserPassword" controller
		const userPayload = c.get("user");
		const { oldPassword, newPassword } = c.req.valid("json");

		const user = await authService.findUserById(userPayload.id);
		if (!user) {
			throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
		}

		// Usamos bcryptjs, como en tu proyecto original
		const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
		if (!isPasswordValid) {
			logger.warn(`Cambio de contraseña fallido para ${userPayload.username}: Contraseña antigua incorrecta.`);
			throw new UnauthorizedError(ERROR_MESSAGES.PASSWORD_OLD_INCORRECT);
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		await authService.updatePassword(user.id, newPasswordHash);

		logger.success(`Contraseña actualizada exitosamente para: ${userPayload.username}`);
		return c.json({
			message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
		});
	},
);
