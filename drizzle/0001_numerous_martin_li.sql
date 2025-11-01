ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_pokemon_id_pk";--> statement-breakpoint
ALTER TABLE "favorites" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_idx" ON "favorites" USING btree ("user_id","pokemon_id");