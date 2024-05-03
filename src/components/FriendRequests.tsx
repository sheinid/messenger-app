"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, Frown, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FriendRequestsProps {
	sessionId: string;
	incomingFriendRequests: IncomingFriendRequest[];
}

function FriendRequests({
	sessionId,
	incomingFriendRequests,
}: FriendRequestsProps) {
	const router = useRouter();

	const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
		incomingFriendRequests
	);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);

		const friendRequestHandler = ({
			senderId,
			senderEmail,
		}: IncomingFriendRequest) => {
			setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
		};

		pusherClient.bind("incoming_friend_request", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unbind("incoming_friend_request", friendRequestHandler);
		};
	}, []);

	const acceptFriend = async (senderId: string) => {
		await axios.post("/api/friends/accept", {
			id: senderId,
		});

		setFriendRequests((prev) =>
			prev.filter((request) => request.senderId != senderId)
		);

		router.refresh();
	};

	const declineFriend = async (senderId: string) => {
		await axios.post("/api/friends/decline", {
			id: senderId,
		});

		setFriendRequests((prev) =>
			prev.filter((request) => request.senderId != senderId)
		);

		router.refresh();
	};

	return (
		<>
			{friendRequests.length === 0 ? (
				<p className="text-sm text-zinc-500 flex gap-x-2 items-center">
					You've got no friend requests <Frown className="h-5 w-5" />
				</p>
			) : (
				friendRequests.map((request) => (
					<div key={request.senderId} className="flex gap-4 items-center">
						<UserPlus className="text-black" />
						<p className="font-medium text-lg">{request.senderEmail}</p>
						<button
							onClick={() => acceptFriend(request.senderId)}
							aria-label="Accept friend"
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<Check className="font-semibold text-white w-1/2 h-1/2" />
						</button>
						<button
							onClick={() => declineFriend(request.senderId)}
							aria-label="Decline friend"
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<X className="font-semibold text-white w-1/2 h-1/2" />
						</button>
					</div>
				))
			)}
		</>
	);
}

export default FriendRequests;
