import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Fulltime",
  short_name: "Fulltime",
  description: "Conectando famílias a profissionais especializados em neurodivergência",
  start_url: "/",
  display: "standalone",
  background_color: "#F8FAFD",
  theme_color: "#0B76B8",
  icons: [
    { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;
