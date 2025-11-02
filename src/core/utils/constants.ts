// src/core/constants.ts

/**
 * @fileoverview Constantes centralizadas de la aplicación.
 * @module core/constants
 * @description Define mensajes de error comunes, prefijos y otros valores fijos
 * para mantener la consistencia y facilitar el mantenimiento.
 */

/**
 * @constant AUTH_TOKEN_PREFIX
 * @description Prefijo estándar utilizado en los encabezados de autorización para tokens JWT.
 * @type {string}
 * @default "Bearer "
 */
export const AUTH_TOKEN_PREFIX: string = "Bearer ";

/**
 * @constant ERROR_MESSAGES
 * @description Colección de mensajes de error estandarizados para toda la aplicación.
 * @property {string} USERNAME_IN_USE - Mensaje para nombre de usuario duplicado.
 * @property {string} EMAIL_IN_USE - Mensaje para email duplicado.
 * @property {string} INVALID_CREDENTIALS - Mensaje para credenciales de inicio de sesión incorrectas.
 * @property {string} USER_NOT_FOUND - Mensaje cuando un usuario no se encuentra en la base de datos.
 * @property {string} PASSWORD_INCORRECT - Mensaje para contraseña incorrecta.
 * @property {string} TOKEN_REQUIRED - Mensaje cuando el token de autenticación no se proporciona.
 * @property {string} TOKEN_INVALID_FORMAT - Mensaje para un formato de token incorrecto.
 * @property {string} TOKEN_INVALID_OR_EXPIRED - Mensaje para un token que es inválido o ha expirado.
 * @property {string} VALIDATION_USERNAME_REQUIRED - Mensaje de validación para nombre de usuario requerido.
 * @property {string} VALIDATION_USERNAME_MIN_LENGTH - Mensaje de validación para la longitud mínima del nombre de usuario.
 * @property {string} VALIDATION_EMAIL_INVALID - Mensaje de validación para un formato de email inválido.
 * @property {string} VALIDATION_PASSWORD_MIN_LENGTH - Mensaje de validación para la longitud mínima de la contraseña.
 * @property {string} VALIDATION_PASSWORD_REQUIRED - Mensaje de validación para contraseña requerida.
 * @property {string} INVALID_INPUT - Mensaje genérico para datos de entrada inválidos.
 * @property {string} INTERNAL_SERVER_ERROR - Mensaje para errores internos del servidor (código 500).
 * @property {string} RESOURCE_NOT_FOUND - Mensaje para recursos no encontrados (código 404).
 * @property {string} CONFLICT - Mensaje para conflictos de recursos, como duplicados (código 409).
 * @property {string} BAD_REQUEST - Mensaje para peticiones mal formadas (código 400).
 * @property {string} UNAUTHORIZED - Mensaje para acceso no autorizado (código 401).
 * @property {string} TOO_MANY_REQUESTS - Mensaje para limitar la tasa de solicitudes.
 * @property {string} VALIDATION_POKEMON_ID_REQUIRED - Mensaje de validación para el ID de Pokémon requerido.
 * @property {string} FAVORITE_ALREADY_EXISTS - Mensaje cuando un Pokémon ya existe en favoritos.
 * @property {string} FAVORITE_NOT_FOUND - Mensaje cuando un Pokémon no se encuentra en favoritos.
 * @property {string} VALIDATION_SEARCH_TERM_REQUIRED - Mensaje de validación para el término de búsqueda requerido.
 * @property {string} HISTORY_ENTRY_NOT_FOUND - Mensaje cuando una entrada del historial no se encuentra.
 * @property {string} HISTORY_FORBIDDEN - Mensaje cuando un usuario no tiene permiso para una acción en el historial.
 */
export const ERROR_MESSAGES = {
	// Errores específicos de Auth
	USERNAME_IN_USE: "El nombre de usuario ya está en uso",
	EMAIL_IN_USE: "El email ya está en uso",
	INVALID_CREDENTIALS: "Credenciales inválidas",
	USER_NOT_FOUND: "Usuario no encontrado",
	PASSWORD_INCORRECT: "Contraseña incorrecta",
	PASSWORD_OLD_INCORRECT: "La contraseña actual es incorrecta.",

	// Errores de Tokens (Middleware)
	TOKEN_REQUIRED: "Acceso denegado. No se proveyó token.",
	TOKEN_INVALID_FORMAT: "Formato de token inválido.",
	TOKEN_INVALID_OR_EXPIRED: "Token inválido o expirado.",
	TOKEN_PAYLOAD_INVALID: "Formato de payload de token inválido.",
	JWT_SECRET_NOT_DEFINED: "JWT_SECRET no está definido en las variables de entorno.",

	// Errores de Validación (zod)
	VALIDATION_USERNAME_REQUIRED: "El nombre de usuario es requerido.",
	VALIDATION_USERNAME_MIN_LENGTH: "El nombre de usuario debe tener al menos 3 caracteres.",
	VALIDATION_EMAIL_INVALID: "Debe ser un email válido.",
	VALIDATION_PASSWORD_MIN_LENGTH: "La contraseña debe tener al menos 6 caracteres.",
	VALIDATION_PASSWORD_REQUIRED: "La contraseña es requerida.",
	VALIDATION_PASSWORD_OLD_REQUIRED: "La contraseña actual es requerida.",
	VALIDATION_PASSWORD_NEW_REQUIRED: "La nueva contraseña es requerida.",
	VALIDATION_PASSWORD_NEW_MIN_LENGTH: "La nueva contraseña debe tener al menos 6 caracteres.",

	// Errores Genéricos (Clases de Error y Validación)
	INVALID_INPUT: "Datos de entrada inválidos",
	INTERNAL_SERVER_ERROR: "Error interno del servidor.",
	RESOURCE_NOT_FOUND: "Recurso no encontrado.",
	CONFLICT: "El recurso ya existe.",
	BAD_REQUEST: "Petición inválida.",
	UNAUTHORIZED: "No autorizado.",
	TOO_MANY_REQUESTS: "Demasiadas peticiones desde esta IP, por favor intente de nuevo después de un minuto.",
	VALIDATION_POKEMON_ID_REQUIRED: "El pokemonId es requerido y debe ser un número.",
	FAVORITE_ALREADY_EXISTS: "Este Pokémon ya está en tus favoritos.",
	FAVORITE_NOT_FOUND: "Este Pokémon no se encontró en tus favoritos.",
	VALIDATION_SEARCH_TERM_REQUIRED: 'El "searchTerm" es requerido y debe ser un string.',
	HISTORY_ENTRY_NOT_FOUND: "Entrada de historial no encontrada.",
	HISTORY_FORBIDDEN: "No tienes permiso para eliminar esta entrada.",
	VALIDATION_LIST_NAME_REQUIRED: "El nombre de la lista es requerido.",
	VALIDATION_LIST_ID_REQUIRED: "El listId es requerido y debe ser un número.",
	LIST_NOT_FOUND: "Lista no encontrada.",
	LIST_FORBIDDEN: "No tienes permiso para modificar o ver esta lista.",
	POKEMON_ALREADY_IN_LIST: "El Pokémon ya existe en esta lista.",
	POKEMON_NOT_IN_LIST: "El Pokémon no se encontró en esta lista.",
};

/**
 * @constant SUCCESS_MESSAGES
 * @description Colección de mensajes de éxito estandarizados para confirmar operaciones.
 * @property {string} REGISTER_SUCCESS - Mensaje de confirmación para registro de usuario exitoso.
 * @property {string} LOGIN_SUCCESS - Mensaje de confirmación para inicio de sesión exitoso.
 * @property {string} FAVORITE_ADDED - Mensaje de confirmación al añadir un Pokémon a favoritos.
 * @property {string} FAVORITE_REMOVED - Mensaje de confirmación al eliminar un Pokémon de favoritos.
 * @property {string} FAVORITES_FETCHED - Mensaje al obtener la lista de Pokémon favoritos.
 * @property {string} HISTORY_FETCHED - Mensaje al obtener el historial de búsqueda.
 * @property {string} HISTORY_ENTRY_ADDED - Mensaje al guardar un nuevo término de búsqueda.
 * @property {string} HISTORY_ENTRY_REMOVED - Mensaje al eliminar un término de búsqueda.
 */
export const SUCCESS_MESSAGES = {
	REGISTER_SUCCESS: "Usuario registrado exitosamente",
	LOGIN_SUCCESS: "Login exitoso",
	PROFILE_FETCHED: "Perfil de usuario obtenido exitosamente.",
	PASSWORD_CHANGED: "Contraseña actualizada exitosamente.",
	FAVORITE_ADDED: "Pokémon añadido a favoritos.",
	FAVORITE_REMOVED: "Pokémon eliminado de favoritos.",
	FAVORITES_FETCHED: "Lista de Favoritos obtenida exitosamente.",
	HISTORY_FETCHED: "Historial de búsqueda obtenido exitosamente.",
	HISTORY_ENTRY_ADDED: "Término de búsqueda guardado.",
	HISTORY_ENTRY_REMOVED: "Término de búsqueda eliminado.",
	LIST_CREATED: "Lista creada exitosamente.",
	LIST_UPDATED: "Lista actualizada exitosamente.",
	LIST_DELETED: "Lista eliminada exitosamente.",
	LISTS_FETCHED: "Listas obtenidas exitosamente.",
	LIST_DETAILS_FETCHED: "Detalles de la lista obtenidos exitosamente.",
	POKEMON_ADDED_TO_LIST: "Pokémon añadido a la lista.",
	POKEMON_REMOVED_FROM_LIST: "Pokémon eliminado de la lista.",
};

/**
 * @constant ENVIRONMENT_MESSAGES
 * @description Mensajes para indicar el entorno de ejecución de la aplicación.
 * @property {string} DEVELOPMENT - Mensaje para el entorno de desarrollo.
 * @property {string} PRODUCTION - Mensaje para el entorno de producción.
 */
export const ENVIRONMENT_MESSAGES = {
	DEVELOPMENT: "La aplicación está corriendo en entorno de desarrollo.",
	PRODUCTION: "La aplicación está corriendo en entorno de producción.",
};
