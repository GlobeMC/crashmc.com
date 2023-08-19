import type { VitePWAOptions } from "vite-plugin-pwa"

const pwaName = process.env.PWA_NAME || "CrashMC 文档（本地）"

export const pwa: Partial<VitePWAOptions> = {
  outDir: ".vitepress/dist",
  registerType: "prompt",
  includeManifestIcons: false,
  manifest: {
    id: "/",
    name: `${pwaName}`,
    short_name: `${pwaName}`,
    description: "为一般玩家编写的 Minecraft 崩溃分析指南",
    theme_color: "#ffffff",
    start_url: "/?utm_source=web_app_manifest",
    lang: "zh-CN",
    display: "standalone",
    categories: ["minecraft", "crash"],
    icons: [
      {
        src: "logo-new.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  },
  workbox: {
    globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
    globIgnores: ["shortcuts/*.svg"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/cdn\.crashmc\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "github-images-cache",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
}
