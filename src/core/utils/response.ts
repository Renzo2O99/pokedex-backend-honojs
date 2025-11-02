import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

type ResponseData = {
	status?: "success" | "error";
	message?: string;
	[key: string]: unknown;
};

type HonoJsonResponse = (obj: unknown, status?: number, headers?: Record<string, string>) => Response;

export function sendResponse<T extends ResponseData>(c: Context, data: T, statusCode: number = StatusCodes.OK) {
	const { status, ...rest } = data;

	const response: ResponseData = {
		status: status || "success",
		...rest,
	};

	const jsonResponse = c.json as HonoJsonResponse;
	return jsonResponse(response, statusCode);
}
