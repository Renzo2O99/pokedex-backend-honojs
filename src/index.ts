// src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("¡Hola Hono!");
});

const port = 4000;
console.log(`Servidor Hono corriendo en http://localhost:${port} 🚀`);

serve({
	fetch: app.fetch,
	port: port,
});