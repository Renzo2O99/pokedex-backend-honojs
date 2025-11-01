// src/core/db/migrate.ts

/**
 * @fileoverview Script para ejecutar migraciones de la base de datos usando Drizzle ORM.
 * Se conecta a la base de datos configurada (desarrollo o producción) y aplica las migraciones pendientes.
 * @module core/db/migrate
 */

import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "../utils/logger";

/**
 * @constant {boolean} isDevelopment - Indica si el entorno actual es de desarrollo.
 */
const isDevelopment = process.env.NODE_ENV === "development";
/**
 * @constant {string | undefined} devUrl - URL de la base de datos de desarrollo.
 */
const devUrl = process.env.DEVELOPMENT_DATABASE_URL;
/**
 * @constant {string | undefined} prodUrl - URL de la base de datos de producción.
 */
const prodUrl = process.env.DATABASE_URL;

/**
 * @let {string} connectionString - Cadena de conexión a la base de datos a utilizar para la migración.
 */
let connectionString: string;

if (isDevelopment) {
	if (!devUrl) throw new Error("DEVELOPMENT_DATABASE_URL no está definida en .env");
	connectionString = devUrl;
	logger.info("Modo [Desarrollo] - Conectando a la base de datos de desarrollo para migración.");
} else {
	if (!prodUrl) throw new Error("DATABASE_URL no está definida en .env para producción");
	connectionString = prodUrl;
	logger.warn("Modo [Producción] - Conectando a la base de datos de PRODUCCIÓN para migración.");
}

/**
 * @function runMigrate
 * @description Función principal que ejecuta el proceso de migración.
 * Se conecta a la base de datos, inicializa Drizzle y aplica las migraciones.
 * @async
 * @returns {Promise<void>}
 */
const runMigrate = async () => {
	logger.await("Iniciando migración...");

	/**
	 * @constant {postgres.SqlJs} migrationClient - Cliente de PostgreSQL para la migración.
	 */
	const migrationClient = postgres(connectionString, {
		ssl: "require",
		max: 1,
	});

	/**
	 * @constant {PostgresJsDatabase} db - Instancia de Drizzle ORM para la migración.
	 */
	const db = drizzle(migrationClient);

	await migrate(db, { migrationsFolder: "drizzle" });

	logger.success("¡Migración completada exitosamente!");
	await migrationClient.end();
	process.exit(0);
};

runMigrate().catch((err) => {
	logger.error("Error durante la migración:", err);
	process.exit(1);
});
