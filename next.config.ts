import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: "tame-nightingale-955.convex.cloud"
			}
		]
	}
};

export default nextConfig;
