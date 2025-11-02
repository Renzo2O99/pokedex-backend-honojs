// src/features/search-history/search-history.types.ts

/**
 * @interface SearchHistoryEntry
 * @description Define la forma de un objeto de entrada del historial de búsqueda.
 */
export interface SearchHistoryEntry {
	id: number;
	userId: number;
	searchTerm: string;
	createdAt: Date;
}
