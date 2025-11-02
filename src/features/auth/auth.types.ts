// src/features/auth/auth.types.ts

/**
 * @interface RegisteredUser
 * @description Define la forma de un objeto de usuario registrado, sin información sensible.
 */
export interface RegisteredUser {
	id: number;
	username: string;
	email: string;
}

/**
 * @interface LoginResult
 * @description Define la forma del objeto devuelto al iniciar sesión correctamente.
 */
export interface LoginResult {
	token: string;
	user: {
		id: number;
		username: string;
		email: string;
	};
}

/**
 * @interface UserWithPassword
 * @description Define la forma de un objeto de usuario que incluye el hash de la contraseña.
 * Se utiliza internamente en el servicio de autenticación.
 */
export interface UserWithPassword extends RegisteredUser {
	passwordHash: string;
	createdAt: Date;
}
