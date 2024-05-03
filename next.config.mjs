/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
	},
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
};

export default nextConfig;
