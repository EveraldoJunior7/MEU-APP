import type { MetadataRoute } from "next";

/**
 * Manifesto do PWA — o "documento de identidade" do app.
 * O Next gera automaticamente /manifest.webmanifest e injeta o <link> no HTML.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Organiza — seu dia, no lugar",
    short_name: "Organiza",
    description:
      "Organize suas listas, tarefas e compras de um jeito simples e bonito.",
    start_url: "/listas",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // full-bleed, serve também para o recorte "maskable" do Android
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
