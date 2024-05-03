import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { id: idToAccept } = z
			.object({
				id: z.string(),
			})
			.parse(body);

		const session = await getServerSession(authOptions);

		if (!session) {
			return new Response("Unauthorized", { status: 401 });
		}

		const isAlreadyFriends = await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			idToAccept
		);

		if (isAlreadyFriends) {
			return new Response("This user is already your friend", { status: 400 });
		}

		const hasFriendRequest = await fetchRedis(
			"sismember",
			`user:${session.user.id}:incoming_friend_requests`,
			idToAccept
		);

		if (!hasFriendRequest) {
			return new Response("You have no friend requests from this user", {
				status: 400,
			});
		}

		await redis.sadd(`user:${session.user.id}:friends`, idToAccept);

		await redis.sadd(`user:${idToAccept}:friends`, session.user.id);

		await redis.srem(
			`user:${session.user.id}:incoming_friend_requests`,
			idToAccept
		);

		return new Response("OK");
	} catch (e) {
		if (e instanceof z.ZodError) {
			return new Response("Invalid request payload", { status: 422 });
		}

		return new Response("Invalid request", { status: 400 });
	}
}
