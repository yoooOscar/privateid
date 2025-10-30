/** @type {import('next').NextConfig} */
const computedBasePath = process.env.NEXT_BASE_PATH && process.env.NEXT_BASE_PATH.startsWith('/')
  ? process.env.NEXT_BASE_PATH
  : undefined;

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  // Export as static HTML for GitHub Pages
  output: 'export',
  // Ensure next/image works in static export
  images: { unoptimized: true },
  // Better compatibility for static hosting path resolution
  trailingSlash: true,
  // Dynamically set basePath and assetPrefix via env for GitHub Pages
  basePath: computedBasePath,
  assetPrefix: computedBasePath,
};

export default nextConfig;


