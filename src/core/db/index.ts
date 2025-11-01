// src/core/db/index.ts

/**
 * @fileoverview Configuración y conexión a la base de datos PostgreSQL usando Drizzle ORM.
 * @module core/db/index
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { logger } from "../utils/logger";

/**
 * @constant {boolean} isDevelopment - Indica si el entorno actual es de desarrollo.
 */
const isDevelopment = process.env.NODE_ENV === "development";
/**
 * @constant {string | undefined} connectionString - URL de conexión a la base de datos, dependiendo del entorno.
 */
const connectionString = isDevelopment ? process.env.DEVELOPMENT_DATABASE_URL : process.env.DATABASE_URL;

if (!connectionString) {
	const varName = isDevelopment ? "DEVELOPMENT_DATABASE_URL" : "DATABASE_URL";
	logger.fatal(new Error(`${varName} no está definida en .env`));
	throw new Error(`${varName} is not defined`);
}

/**
 * @constant {postgres.SqlJs} client - Cliente de PostgreSQL para la conexión a la base de datos.
 */
const client = postgres(connectionString, { ssl: "require" });

/**
 * @constant {PostgresJsDatabase<typeof schema>} db - Instancia de Drizzle ORM conectada a la base de datos con el esquema definido.
 */
export const db = drizzle(client, { schema: schema });
