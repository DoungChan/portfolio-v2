import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { apps } from "@/lib/apps";

export default function sitemap(): MetadataRoute.Sitemap {
   const routes = ["/", ...Object.values(apps).flatMap((a) => (a.route ? [a.route] : []))];
   return routes.map((route) => ({
      url: new URL(route, profile.website).toString(),
      changeFrequency: "monthly",
      priority: route === "/" ? 1 : 0.8,
   }));
}
