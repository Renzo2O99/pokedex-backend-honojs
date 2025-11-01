ALTER TABLE "custom_list_pokemons" DROP CONSTRAINT "custom_list_pokemons_list_id_pokemon_id_pk";--> statement-breakpoint
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_user_id_pokemon_id_pk";--> statement-breakpoint
ALTER TABLE "custom_list_pokemons" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "list_pokemon_idx" ON "custom_list_pokemons" USING btree ("list_id","pokemon_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rating_idx" ON "ratings" USING btree ("user_id","pokemon_id");