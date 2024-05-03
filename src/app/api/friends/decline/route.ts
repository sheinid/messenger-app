import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const session = await getServerSession(authOptions);

		if (!session) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { id: idToDecline } = z
			.object({
				id: z.string(),
			})
			.parse(body);

		await redis.srem(
			`user:${session.user.id}:incoming_friend_requests`,
			idToDecline
		);

		return new Response("OK");
	} catch (e) {
		if (e instanceof z.ZodError) {
			return new Response("Invalid request payload", { status: 422 });
		}

		return new Response("Invalid request", { status: 400 });
	}
}
