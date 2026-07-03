/** @type {import('next').NextConfig} */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `img-src 'self' data: blob:`,
  `connect-src 'self'`,
  `frame-ancestors 'none'`,
].join("; ");

const nextConfig = {
  images: { unoptimized: true },
  webpack: (config) => config,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "0" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/(.*)",
        has: [{ type: "host", value: "localhost" }],
        headers: [
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
