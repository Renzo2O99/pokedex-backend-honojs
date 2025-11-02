import { JwtPayload } from "../features/auth/auth.middleware";

declare module "hono" {
	interface ContextVariableMap {
		user: JwtPayload;
	}
}
