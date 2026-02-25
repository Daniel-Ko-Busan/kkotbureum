import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 프로덕션 소스맵 비활성화 (번들 사이즈 절약)
  productionBrowserSourceMaps: false,
  // 파워드바이 헤더 제거
  poweredByHeader: false,
};

export default nextConfig;
