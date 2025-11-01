// backend-express/src/core/utils/errors.ts

/**
 * @fileoverview Clases de error personalizadas para la aplicación.
 * @module core/utils/errors
 */

/**
 * @class GeneralError
 * @extends Error
 * Clase base para errores personalizados en la aplicación.
 */
export class GeneralError extends Error {
	/** @property {string} name - El nombre del error. */
	public readonly name: string;
	/** @property {number} statusCode - El código de estado HTTP asociado al error. */
	public readonly statusCode: number;

	/**
	 * @constructor
	 * @param {string} message - El mensaje de error.
	 * @param {string} name - El nombre del error.
	 * @param {number} statusCode - El código de estado HTTP.
	 */
	constructor(message: string, name: string, statusCode: number) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

// --- Clases de error específicas ---

/**
 * @class ConflictError
 * @extends GeneralError
 * @description Representa un error de conflicto (409).
 */
export class ConflictError extends GeneralError {
	/**
	 * @constructor
	 * @param {string} [message="El recurso ya existe."] - El mensaje de error.
	 */
	constructor(message: string = "El recurso ya existe.") {
		super(message, "ConflictError", 409);
	}
}

/**
 * @class UnauthorizedError
 * @extends GeneralError
 * @description Representa un error de no autorizado (401).
 */
export class UnauthorizedError extends GeneralError {
	/**
	 * @constructor
	 * @param {string} [message="Credenciales inválidas."] - El mensaje de error.
	 */
	constructor(message: string = "Credenciales inválidas.") {
		super(message, "UnauthorizedError", 401);
	}
}

/**
 * @class NotFoundError
 * @extends GeneralError
 * @description Representa un error de no encontrado (404).
 */
export class NotFoundError extends GeneralError {
	/**
	 * @constructor
	 * @param {string} [message="Recurso no encontrado."] - El mensaje de error.
	 */
	constructor(message: string = "Recurso no encontrado.") {
		super(message, "NotFoundError", 404);
	}
}

/**
 * @class BadRequestError
 * @extends GeneralError
 * @description Representa un error de petición inválida (400).
 */
export class BadRequestError extends GeneralError {
	/**
	 * @constructor
	 * @param {string} [message="Petición inválida."] - El mensaje de error.
	 */
	constructor(message: string = "Petición inválida.") {
		super(message, "BadRequestError", 400);
	}
}

/**
 * @class InternalServerError
 * @extends GeneralError
 * @description Representa un error interno del servidor (500).
 */
export class InternalServerError extends GeneralError {
	/**
	 * @constructor
	 * @param {string} [message="Error interno del servidor."] - El mensaje de error.
	 */
	constructor(message: string = "Error interno del servidor.") {
		super(message, "InternalServerError", 500);
	}
}
