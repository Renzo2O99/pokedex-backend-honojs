// src/core/utils/logger.ts

/**
 * @fileoverview Utilidad de registro (logging) para la aplicación, utilizando `chalk` para una salida coloreada en la consola.
 * Proporciona métodos para diferentes niveles de registro como información, éxito, advertencia, error y fatal.
 * @module core/utils/logger
 */

import chalk from "chalk";

/**
 * @constant {object} logger - Objeto que contiene métodos para registrar mensajes en la consola con diferentes niveles de severidad y colores.
 */
export const logger = {
	/**
	 * @method log
	 * @description Registra un mensaje general en blanco.
	 * @param {string} message - El mensaje a registrar.
	 */
	log: (message: string) => console.log(chalk.white(message)),
	/**
	 * @method info
	 * @description Registra un mensaje informativo en color naranja/marrón.
	 * @param {string} message - El mensaje a registrar.
	 */
	info: (message: string) => console.log(chalk.hex("#cb6b11ff").bold(message)),
	/**
	 * @method success
	 * @description Registra un mensaje de éxito en color verde.
	 * @param {string} message - El mensaje a registrar.
	 */
	success: (message: string) => console.log(chalk.hex("#127a20ff").bold(message)),
	/**
	 * @method warn
	 * @description Registra un mensaje de advertencia en color amarillo.
	 * @param {string} message - El mensaje a registrar.
	 */
	warn: (message: string) => console.log(chalk.yellow(message)),
	/**
	 * @method error
	 * @description Registra un mensaje de error en color rojo. Opcionalmente, puede incluir un objeto de error.
	 * @param {string} message - El mensaje de error a registrar.
	 * @param {unknown} [error] - Objeto de error adicional para registrar.
	 */
	error: (message: string, error?: unknown) => {
		console.log(chalk.bold.red(message));
		if (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.log(chalk.red(errorMessage));
		}
	},
	/**
	 * @method fatal
	 * @description Registra un error fatal en un recuadro rojo y termina el proceso de la aplicación.
	 * @param {Error} error - El objeto de error fatal a registrar.
	 */
	fatal: (error: Error) => {
		console.log(chalk.bgRed.white("FATAL ERROR"));
		console.log(chalk.red(error.stack));
		process.exit(1);
	},
	/**
	 * @method await
	 * @description Registra un mensaje de estado "esperando" en color cian.
	 * @param {string} message - El mensaje a registrar.
	 */
	await: (message: string) => console.log(chalk.cyan(message)),
};
