import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { redis } from "./redis";
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentials() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

	if (!clientId || clientId.length === 0) {
		throw new Error("Missing GOOGLE_CLIENT_ID");
	}

	if (!clientSecret || clientSecret.length === 0) {
		throw new Error("Missing GOOGLE_CLIENT_SECRET");
	}

	return {
		clientId,
		clientSecret,
	};
}

export const authOptions: NextAuthOptions = {
	adapter: UpstashRedisAdapter(redis),
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientId,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
	],
	callbacks: {
		async jwt({ user, token }) {
			const dbUserRes = (await fetchRedis("get", `user:${token.id}`)) as
				| string
				| null;

			if (!dbUserRes) {
				token.id = user!.id;
				return token;
			}

			const dbUser = JSON.parse(dbUserRes) as User;

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}

			return session;
		},
		async redirect() {
			return `${process.env.NEXTAUTH_URL}/dashboard`;
		},
	},
};
