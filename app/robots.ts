import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/premium/"],
    },
    sitemap: "https://unearthed.app/sitemap.xml",
  };
}
