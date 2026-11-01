import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
   return {
      name: `${profile.name} — ${profile.role}`,
      short_name: profile.shortName,
      start_url: "/",
      display: "standalone",
      background_color: "#141428",
      theme_color: "#141428",
      icons: [
         { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
         { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
   };
}
