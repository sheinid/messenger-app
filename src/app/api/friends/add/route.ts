import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { email: emailToAdd } = addFriendValidator.parse(body.email);

		const idToAdd = (await fetchRedis(
			"get",
			`user:email:${emailToAdd}`
		)) as string;

		if (!idToAdd) {
			return new Response("This person does not exist", { status: 400 });
		}

		const session = await getServerSession(authOptions);

		if (!session) {
			return new Response("Unauthorized", { status: 401 });
		}

		if (idToAdd === session.user.id) {
			return new Response("You cannot add yourself as a friend", {
				status: 400,
			});
		}

		const isAlreadyAdded = (await fetchRedis(
			"sismember",
			`user:${idToAdd}:incoming_friend_requests`,
			session.user.id
		)) as 0 | 1;

		if (isAlreadyAdded) {
			return new Response("This user already has your request", {
				status: 400,
			});
		}

		const isAlreadyFriend = (await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			idToAdd
		)) as 0 | 1;

		if (isAlreadyFriend) {
			return new Response("This user is already your friend", {
				status: 400,
			});
		}

		pusherServer.trigger(
			toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
			"incoming_friend_requests",
			{
				senderId: session.user.id,
				senderEmail: session.user.email,
			}
		);

		redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

		return new Response("OK", { status: 200 });
	} catch (e) {
		if (e instanceof z.ZodError) {
			return new Response("Invalid payload", { status: 422 });
		}

		return new Response("Invalid request", { status: 400 });
	}
}
