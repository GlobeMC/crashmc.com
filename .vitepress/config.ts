import { defineConfigWithTheme } from "vitepress"
import { withPwa } from "@vite-pwa/vitepress"

// configs
import viteConfig from "./theme/configs/vite"
import pwaConfig from "./theme/configs/pwa"
import themeConfig from "./theme/configs/theme"
import markdownitConfig from "./theme/configs/markdownit"

export default withPwa(
	defineConfigWithTheme({
		title: "GlobeMC",
		lang: "zh-CN",
		lastUpdated: true,
		description: "为普通玩家编写的 Minecraft 崩溃分析指南",
		srcDir: "docs",
		cleanUrls: true,

		themeConfig: themeConfig,
		markdown: markdownitConfig,
		vite: viteConfig,
		pwa: pwaConfig,

		rewrites: {
			"blog": "blog/"
		},

		sitemap: {
			hostname: "https://crashmc.com",
		},

		head: [
			["link", { rel: "icon", href: "/favicon.ico" }],
			[
				"link",
				{ rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png" },
			],
			[
				"script",
				{
					async: "",
					src: "https://status.crashmc.com/script.js",
					"data-website-id": "6c316054-6e56-402b-8246-39311e4ad0a4",
				},
			],
		],
	}),
)
