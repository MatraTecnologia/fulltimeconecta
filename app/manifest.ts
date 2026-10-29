import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "NeuroConecta",
  short_name: "NeuroConecta",
  description: "Conectando famílias a profissionais especializados em neurodivergência",
  start_url: "/",
  display: "standalone",
  background_color: "#FAF8F5",
  theme_color: "#0E7C7B",
  icons: [
    { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;
