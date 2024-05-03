import Button from "@/components/ui/Button";
import { redis } from "@/lib/redis";
import Link from "next/link";

export default async function Home() {
	return (
		<Button>
			<Link href="/login">Hello</Link>
		</Button>
	);
}
