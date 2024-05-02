import process from "node:process"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitepress"
import type { DefaultTheme } from "vitepress/theme"
import { withPwa, type PwaOptions } from "@vite-pwa/vitepress"
import { cwd } from 'node:process'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import {
	InlineLinkPreviewElementTransform
} from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import {
	GitChangelog,
	GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'

const COMMIT_ID = process.env.CF_PAGES_COMMIT_SHA || "local"
const commitRef = COMMIT_ID?.slice(0, 8)
const environment = process.env.DEPLOYMENT_STATUS || process.env.NODE_ENV
const pwaName = process.env.PWA_NAME || "CrashMC 文档（本地）"

const viteConfig = {
	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
		},
	},
	optimizeDeps: {
		include: [
			// @rive-app/canvas is a CJS/UMD module, so it needs to be included here
			// for Vite to properly bundle it.
			'@nolebase/vitepress-plugin-enhanced-readabilities > @nolebase/ui > @rive-app/canvas',
		],
		exclude: [
			'@nolebase/vitepress-plugin-enhanced-readabilities/client',
		],
	},
	ssr: {
		noExternal: [
			// 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
			'@nolebase/vitepress-plugin-enhanced-readabilities',
			'@nolebase/vitepress-plugin-inline-link-preview',
		],
	},
	plugins: [
		GitChangelog({
			// 填写在此处填写您的仓库链接
			repoURL: () => 'https://github.com/GlobeMC/crashmc.com',
		}),
		GitChangelogMarkdownSection({
			locales: {
				gitChangelogMarkdownSectionTitles: {
					changelog: '文件历史',
					contributors: '贡献者',
				},
			},
		}),
	]
}

const pwaConfig: PwaOptions = {
	devOptions: {
		enabled: true,
	},
	outDir: "../.vitepress/dist",
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
				src: "logo-new.webp",
				sizes: "1024x1024",
				type: "image/webp",
			},
			{
				src: "pwa-512x512.webp",
				sizes: "512x512",
				type: "image/webp",
			},
			{
				src: "pwa-192x192.webp",
				sizes: "192x192",
				type: "image/webp",
			},
			{
				src: "pwa-64x64.webp",
				sizes: "64x64",
				type: "image/webp",
			},
		],
	},
	workbox: {
		globPatterns: ["**/*.{css,js,html,svg,webp,ico,txt,woff2}"],
		globIgnores: ["shortcuts/*.svg"],
		globDirectory: ".vitepress/dist",
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

const themeConfig: DefaultTheme.Config = {
	lastUpdated: {
		text: "最后更新",
	},
	outlineTitle: "目录",
	logo: "/logo-brand.webp",
	nav: [
		{ text: "主页", link: "/" },
		{ text: "崩溃分析工具", link: "/analyzer" },
		{
			text: "贡献",
			activeMatch: "/contribute/*",
			items: [
				{ text: "贡献指南", link: "/contribute/contributing" },
				{
					text: "崩溃提交",
					link: "/contribute/crash-report",
				},
				{ text: "贡献者列表", link: "/contribute/contributors" },
			],
		},
		{ text: "捐赠支持", link: "https://afdian.net/a/Pigeon0v0" },
	],

	footer: {
		message: `Released under the <a href="https://github.com/GlobeMC/crashmc.com/blob/main/LICENSE">GFDL License</a>.<br />GlobeMC/crashmc.com<br />${environment}@<a href="https://github.com/GlobeMC/crashmc.com/commit/${commitRef}" target="_blank" alt=${commitRef}>${commitRef}</a>`,
		copyright:
			'Copyright © 2023-present <a href="https://github.com/GlobeMC">GlobeMC / 河豚分析</a>',
	},

	search: {
		provider: "algolia",
		options: {
			appId: "A163FFFXG6",
			apiKey: "a8c4a4fedda9caccaed0b99fa4d7999e",
			indexName: "crashmc",
			placeholder: "搜索楞何楞想要得嘢？",
			translations: {
				button: {
					buttonText: "搜索楞何楞想要得嘢？",
					buttonAriaLabel: "搜索文档",
				},
				modal: {
					searchBox: {
						resetButtonTitle: "清除查询条件",
						resetButtonAriaLabel: "清除查询条件",
						cancelButtonText: "取消",
						cancelButtonAriaLabel: "取消",
					},
					startScreen: {
						recentSearchesTitle: "搜索历史",
						noRecentSearchesText: "没有搜索历史",
						saveRecentSearchButtonTitle: "保存至搜索历史",
						removeRecentSearchButtonTitle: "从搜索历史中移除",
						favoriteSearchesTitle: "收藏",
						removeFavoriteSearchButtonTitle: "从收藏中移除",
					},
					errorScreen: {
						titleText: "无法获取结果",
						helpText: "你可能需要检查你的网络连接",
					},
					footer: {
						selectText: "选择",
						navigateText: "切换",
						closeText: "关闭",
						searchByText: "搜索提供者",
					},
					noResultsScreen: {
						noResultsText: "无法找到相关结果",
						suggestedQueryText: "你可以尝试查询",
						reportMissingResultsText: "你认为该查询应该有结果？",
						reportMissingResultsLinkText: "点击反馈",
					},
				},
			},
		},
	},

	sidebar: [
		{
			text: "工具",
			items: [{ text: "崩溃分析工具", link: "/analyzer" }],
		},
		{
			text: "文档",
			items: [
				{ text: "基础知识", link: "/basis" },
				{ text: "通用问题", link: "/commons" },
				{
					text: "客户端崩溃",
					items: [
						{ text: "客户端介绍", link: "/client/" },
						{ text: "通用问题", link: "/client/shared" },
						{ text: "系统问题", link: "/client/system" },
						{ text: "原版问题", link: "/client/vanilla" },
						{ text: "Mod 问题", link: "/client/mods" },
					],
				},
				{
					text: "服务端崩溃",
					items: [
						{ text: "服务端介绍", link: "/server/" },
						{ text: "通用问题", link: "/server/shared" },
						{ text: "原版问题", link: "/server/vanilla" },
						{ text: "Mod 端问题", link: "/server/mods" },
						{ text: "插件端问题", link: "/server/plugins" },
						{ text: "整合端问题", link: "/server/hybrid" },
						{ text: "跨服端问题", link: "/server/proxy" },
					],
				},
				{ text: "Mixin", link: "/mixin" },
			],
		},
		{
			text: "贡献",
			items: [
				{ text: "贡献指南", link: "/contribute/contributing" },
				{
					text: "崩溃提交",
					link: "/contribute/crash-report",
				},
				{ text: "贡献者名单", link: "/contribute/contributors.html" },
			],
		},
	],

	socialLinks: [{ icon: "github", link: "https://github.com/GlobeMC" }],

	editLink: {
		pattern: "https://github.com/GlobeMC/crashmc.com/edit/dev/docs/:path",
		text: "在 GitHub 上帮助我们完善这个页面",
	},

	docFooter: {
		prev: "上一页",
		next: "下一页",
	},

	sidebarMenuLabel: "菜单",
	returnToTopLabel: "返回顶部",
	externalLinkIcon: true,
	darkModeSwitchLabel: "外观",
	lightModeSwitchTitle: "切换到浅色模式",
	darkModeSwitchTitle: "切换到深色模式",
}

export default withPwa(
	defineConfig({
		title: "GlobeMC",
		lang: "zh-CN",
		lastUpdated: true,
		description: "为一般玩家编写的 Minecraft 崩溃分析指南",
		srcDir: "docs",
		themeConfig: themeConfig,
		cleanUrls: true,

		markdown: {
			image: {
				lazyLoading: true,
			},
			theme: {
				light: "material-theme-lighter",
				dark: "material-theme-palenight",
			},
			lineNumbers: true,
			config: (md) => {
				// @ts-expect-error TS2769
				md.use(BiDirectionalLinks({
					dir: "docs",
					baseDir: "/",
				})),
				// @ts-expect-error TS2769
				md.use(InlineLinkPreviewElementTransform)
			},
		},

		sitemap: {
			hostname: "https://crashmc.com",
		},

		head: [
			["link", { rel: "icon", href: "/logo-brand.webp" }],
			[
				"script",
				{
					async: "",
					src: "https://status.crashmc.com/script.js",
					"data-website-id": "6c316054-6e56-402b-8246-39311e4ad0a4",
				},
			],
		],

		vite: viteConfig,
		pwa: pwaConfig,
	}),
)
