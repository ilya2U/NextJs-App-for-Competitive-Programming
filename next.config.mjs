/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ant-design',
    'rc-pagination',
    'rc-picker',
  ],
};

export default nextConfig;
