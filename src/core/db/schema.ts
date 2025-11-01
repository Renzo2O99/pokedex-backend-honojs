// src/core/db/schema.ts

/**
 * @fileoverview Define el esquema de la base de datos para la aplicación Pokédex usando Drizzle ORM.
 * Incluye tablas para usuarios, favoritos, historial de búsqueda y listas personalizadas.
 * También define las relaciones entre estas tablas.
 * @module core/db/schema
 */

import { pgTable, serial, varchar, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//? --- Feature: Autenticación ---
/**
 * @table users
 * @description Tabla para almacenar información de los usuarios.
 * @property {number} id - ID único del usuario (serial, clave primaria).
 * @property {string} username - Nombre de usuario único (varchar, no nulo).
 * @property {string} email - Correo electrónico único del usuario (varchar, no nulo).
 * @property {string} passwordHash - Hash de la contraseña del usuario (text, no nulo).
 * @property {Date} createdAt - Marca de tiempo de creación del usuario (timestamp, por defecto ahora, no nulo).
 */
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 256 }).unique().notNull(),
	email: varchar("email", { length: 256 }).unique().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

//? --- Feature: Favoritos ---
/**
 * @table favorites
 * @description Tabla para almacenar los Pokémon favoritos de los usuarios.
 * @property {number} userId - ID del usuario que marca el Pokémon como favorito (entero, clave foránea a `users.id`).
 * @property {number} pokemonId - ID del Pokémon favorito (entero, no nulo).
 * @property {Date} createdAt - Marca de tiempo de cuando se añadió el favorito (timestamp, por defecto ahora, no nulo).
 * @constraint primaryKey - Un usuario solo puede tener un Pokémon favorito una vez.
 */
export const favorites = pgTable(
	"favorites",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		pokemonId: integer("pokemon_id").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		favoriteIndex: uniqueIndex("favorite_idx").on(table.userId, table.pokemonId),
	}),
);

//? --- Feature: Historial de Búsquedas ---
/**
 * @table searchHistory
 * @description Tabla para almacenar el historial de búsqueda de los usuarios.
 * @property {number} id - ID único de la entrada del historial (serial, clave primaria).
 * @property {number} userId - ID del usuario que realizó la búsqueda (entero, clave foránea a `users.id`).
 * @property {string} searchTerm - Término de búsqueda (varchar, no nulo).
 * @property {Date} createdAt - Marca de tiempo de cuando se realizó la búsqueda (timestamp, por defecto ahora, no nulo).
 * @constraint searchIndex - Asegura que la combinación de un usuario y un término de búsqueda sea única.
 */
export const searchHistory = pgTable(
	"search_history",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		searchTerm: varchar("search_term", { length: 256 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		// Esto asegura que la combinación de un usuario y un término de búsqueda sea única.
		searchIndex: uniqueIndex("search_idx").on(table.userId, table.searchTerm),
	}),
);

//? --- Feature: Listas Personalizadas ---
/**
 * @table customLists
 * @description Tabla para almacenar listas personalizadas de Pokémon creadas por los usuarios.
 * @property {number} id - ID único de la lista (serial, clave primaria).
 * @property {number} userId - ID del usuario propietario de la lista (entero, clave foránea a `users.id`).
 * @property {string} name - Nombre de la lista (varchar, no nulo).
 * @property {Date} createdAt - Marca de tiempo de creación de la lista (timestamp, por defecto ahora, no nulo).
 */
export const customLists = pgTable("custom_lists", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 256 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * @table customListPokemons
 * @description Tabla pivote para la relación muchos a muchos entre `customLists` y Pokémon.
 * Almacena qué Pokémon pertenecen a qué lista personalizada.
 * @property {number} listId - ID de la lista personalizada (entero, clave foránea a `customLists.id`).
 * @property {number} pokemonId - ID del Pokémon (entero, no nulo).
 * @constraint primaryKey - Una lista solo puede contener un Pokémon específico una vez.
 */
export const customListPokemons = pgTable(
	"custom_list_pokemons",
	{
		id: serial("id").primaryKey(),
		listId: integer("list_id")
			.notNull()
			.references(() => customLists.id, { onDelete: "cascade" }),
		pokemonId: integer("pokemon_id").notNull(),
	},
	(table) => ({
		listPokemonIndex: uniqueIndex("list_pokemon_idx").on(table.listId, table.pokemonId),
	}),
);

//? === DEFINICIÓN DE RELACIONES ===

/**
 * @relation usersRelations
 * @description Define las relaciones de la tabla `users` con otras tablas.
 * Un usuario puede tener muchos favoritos, muchas entradas en el historial de búsqueda y muchas listas personalizadas.
 */
export const usersRelations = relations(users, ({ many }) => ({
	favorites: many(favorites),
	searchHistory: many(searchHistory),
	customLists: many(customLists),
	// Omitimos comments y ratings como pediste
}));

/**
 * @relation favoritesRelations
 * @description Define las relaciones de la tabla `favorites`.
 * Una entrada de favorito pertenece a un único usuario.
 */
export const favoritesRelations = relations(favorites, ({ one }) => ({
	// Un favorito pertenece a un solo usuario
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id],
	}),
}));

/**
 * @relation searchHistoryRelations
 * @description Define las relaciones de la tabla `searchHistory`.
 * Una entrada del historial de búsqueda pertenece a un único usuario.
 */
export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
	// Una entrada de historial pertenece a un solo usuario
	user: one(users, {
		fields: [searchHistory.userId],
		references: [users.id],
	}),
}));

/**
 * @relation customListsRelations
 * @description Define las relaciones de la tabla `customLists`.
 * Una lista personalizada pertenece a un único usuario y puede contener muchos Pokémon.
 */
export const customListsRelations = relations(customLists, ({ one, many }) => ({
	// Una lista pertenece a un solo usuario
	user: one(users, {
		fields: [customLists.userId],
		references: [users.id],
	}),
	// Una lista puede tener muchos Pokémon
	pokemons: many(customListPokemons),
}));

/**
 * @relation customListPokemonsRelations
 * @description Define las relaciones de la tabla `customListPokemons`.
 * Una entrada de Pokémon en una lista pertenece a una única lista personalizada.
 */
export const customListPokemonsRelations = relations(customListPokemons, ({ one }) => ({
	// Una entrada "pokemon de lista" pertenece a una sola lista
	list: one(customLists, {
		fields: [customListPokemons.listId],
		references: [customLists.id],
	}),
}));
