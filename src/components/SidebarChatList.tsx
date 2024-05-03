"use client";

import { chatUrlConstructor } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarChatListProps {
	sessionId: string;
	friends: User[];
}

function SidebarChatList({ sessionId, friends }: SidebarChatListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (pathname.includes("chat")) {
			setUnseenMessages((prev) =>
				prev.filter((m) => !pathname.includes(m.senderId))
			);
		}
	}, [pathname]);

	return (
		<ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
			{friends.sort().map((friend) => {
				const unseenMessagesCount = unseenMessages.filter(
					(msg) => msg.senderId === friend.id
				).length;

				return (
					<li key={friend.id}>
						<a
							className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
							href={`/dashboard/chat/${chatUrlConstructor(
								sessionId,
								friend.id
							)}`}
						>
							<div className="relative w-6 h-6">
								<Image
									fill
									referrerPolicy="no-referrer"
									className="rounded-full"
									src={friend.image}
									alt={friend.name}
								/>
							</div>
							{friend.name}
							{unseenMessagesCount > 0 ? (
								<div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
									{unseenMessagesCount}
								</div>
							) : null}
						</a>
					</li>
				);
			})}
		</ul>
	);
}

export default SidebarChatList;
