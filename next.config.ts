import type { NextConfig } from "next";

// Export estático: el sitio no usa funciones de servidor, así que `next build`
// genera HTML/JS/CSS en `out/`, que el Worker de Cloudflare sirve como assets
// (ver wrangler.jsonc).
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
