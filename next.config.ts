import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Permite acessar o dev server via Tailscale funnel / rede local
  allowedDevOrigins: ['*.ts.net', '100.96.190.124'],
};

export default nextConfig;
