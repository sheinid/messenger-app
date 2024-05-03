import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function FriendRequestsPage() {
	const session = await getServerSession(authOptions);

	if (!session) notFound();

	const incomingSenderIds = (await fetchRedis(
		"smembers",
		`user:${session.user.id}:incoming_friend_requests`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingSenderIds.map(async (senderId) => {
			const senderRes = (await fetchRedis("get", `user:${senderId}`)) as string;
			const sender = JSON.parse(senderRes) as User;

			return {
				senderId,
				senderEmail: sender.email,
			};
		})
	);

	return (
		<main className="pt-8">
			<h1 className="font-bold text-5xl mb-8">Friend requests</h1>
			<div className="flex flex-col gap-4">
				<FriendRequests
					sessionId={session.user.id}
					incomingFriendRequests={incomingFriendRequests}
				/>
			</div>
		</main>
	);
}

export default FriendRequestsPage;
