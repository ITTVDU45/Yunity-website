import type { MetadataRoute } from "next"

import { routesForSitemap, siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base = siteConfig.url.replace(/\/$/, "")

  return routesForSitemap.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
