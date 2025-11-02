// src/features/auth/auth.validation.ts
import { z } from "zod";
import { ERROR_MESSAGES } from "../../core/utils/constants";

// Esquema para /register
export const registerSchema = z.object({
	username: z
		.string({ error: () => ERROR_MESSAGES.VALIDATION_USERNAME_REQUIRED })
		.trim()
		.min(3, { error: () => ERROR_MESSAGES.VALIDATION_USERNAME_MIN_LENGTH }),
	email: z
		.email({ error: () => ERROR_MESSAGES.VALIDATION_EMAIL_INVALID })
		.trim()
		.min(1, { error: () => ERROR_MESSAGES.VALIDATION_EMAIL_INVALID }),
	password: z
		.string({ error: () => ERROR_MESSAGES.VALIDATION_PASSWORD_REQUIRED })
		.min(6, { error: () => ERROR_MESSAGES.VALIDATION_PASSWORD_MIN_LENGTH }),
});

// Esquema para /login
export const loginSchema = z.object({
	email: z
		.email({ error: () => ERROR_MESSAGES.VALIDATION_EMAIL_INVALID })
		.trim()
		.min(1, { error: () => ERROR_MESSAGES.VALIDATION_EMAIL_INVALID }),
	password: z.string().min(1, { error: () => ERROR_MESSAGES.VALIDATION_PASSWORD_REQUIRED }),
});

// Esquema para /password
export const changePasswordSchema = z.object({
	oldPassword: z.string().min(1, { error: () => ERROR_MESSAGES.VALIDATION_PASSWORD_OLD_REQUIRED }),
	newPassword: z.string().min(6, { error: () => ERROR_MESSAGES.VALIDATION_PASSWORD_NEW_MIN_LENGTH }),
});
