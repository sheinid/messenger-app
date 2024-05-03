import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function page() {
	const session = await getServerSession(authOptions);

	return <pre>Dashboard</pre>;
}

export default page;
