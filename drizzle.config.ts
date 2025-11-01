import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const isDevelopment = process.env.NODE_ENV === "development";

const devUrl: string = process.env.DEVELOPMENT_DATABASE_URL;
const prodUrl: string = process.env.DATABASE_URL;

if (isDevelopment && !devUrl) {
	throw new Error("DEVELOPMENT_DATABASE_URL no está definida en .env");
}

if (!isDevelopment && !prodUrl) {
	throw new Error("DATABASE_URL no está definida en .env para producción");
}

const connectionString = isDevelopment ? devUrl : prodUrl;

export default defineConfig({
	schema: "./src/core/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString, // <-- USAR LA VARIABLE CALCULADA
	},
});
