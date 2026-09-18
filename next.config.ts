import type { NextConfig } from "next";

// Quando NEXTAUTH_URL aponta pra um túnel (ngrok/cloudflared) usado pra testar
// o checkout do Mercado Pago localmente, libera esse host pro dev server/HMR.
const devTunnelHost = process.env.NEXTAUTH_URL?.startsWith("https://")
  ? new URL(process.env.NEXTAUTH_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: devTunnelHost ? [devTunnelHost] : undefined,
};

export default nextConfig;
