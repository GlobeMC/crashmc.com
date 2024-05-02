import type { EnhanceAppContext } from "vitepress"
import { useData, useRoute } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"

// Components
import LauncherBadge from "./global-components/LauncherBadge.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"

// Plugins
import giscusTalk from "vitepress-plugin-comment-with-giscus"
import vitepressNprogress from "@andatoshiki/vitepress-plugin-nprogress"
import imageViewer from "vitepress-plugin-image-viewer"
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue"
import codeblocksFold from "vitepress-plugin-codeblocks-fold" // import method
import vitepressBackToTop from "vitepress-plugin-back-to-top"
import {
	NolebaseEnhancedReadabilitiesMenu,
	NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client"
import { NolebaseInlineLinkPreviewPlugin } from "@nolebase/vitepress-plugin-inline-link-preview/client"
import { InjectionKey } from "@nolebase/vitepress-plugin-git-changelog/client"
import "@nolebase/vitepress-plugin-inline-link-preview/client/style.css"
import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client"

import "@nolebase/vitepress-plugin-git-changelog/client/style.css"

// Styles
import "./style.css"
import "vitepress-plugin-back-to-top/dist/style.css"
import "vitepress-plugin-codeblocks-fold/style/index.scss"
import "@andatoshiki/vitepress-plugin-nprogress/lib/css/index.css"
import "viewerjs/dist/viewer.min.css"
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css"

function generateAvatarUrl(username: string) {
	return `https://cdn.crashmc.com/https://github.com/${username}.png`
}

export default {
	extends: DefaultTheme,
	Layout() {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"layout-bottom": () => h(ReloadPrompt),
			// 为较宽的屏幕的导航栏添加阅读增强菜单
			"nav-bar-content-after": () => h(NolebaseEnhancedReadabilitiesMenu),
			// 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
			"nav-screen-content-after": () =>
				h(NolebaseEnhancedReadabilitiesScreenMenu),
		})
	},
	enhanceApp(ctx: EnhanceAppContext) {
		vitepressBackToTop({
			// default
			threshold: 300,
		})
		ctx.app.component("LauncherBadge", LauncherBadge)
		vitepressNprogress(ctx)
		ctx.app.component("vImageViewer", vImageViewer)
		ctx.app.use(NolebaseInlineLinkPreviewPlugin)
		ctx.app.use(NolebaseGitChangelogPlugin)
		ctx.app.provide(InjectionKey, {
			mapContributors: [
				{
					name: "Big_Cake",
					nameAliases: ["Big-Cake-jpg", "Big_Cake"],
					avatar: generateAvatarUrl("Big-Cake-jpg"),
				},
				{
					name: "bingling_sama",
					nameAliases: ["bingling-sama", "bingling_sama"],
					avatar: generateAvatarUrl("bingling-sama"),
				},
				{
					name: "柚子柚子",
					nameAliases: ["youzi-2333", "柚子柚子"],
					avatar: generateAvatarUrl("youzi-2333"),
				},
				{
					name: "Pigeon0v0",
					nameAliases: ["bwtx2023", "bwtx1981", "Yousa Ling", "Pigeon0v0"],
					avatar: generateAvatarUrl("Pigeon0v0"),
				},
				{
					name: "233355607",
					nameAliases: ["2623684696", "233355607"],
					avatar: generateAvatarUrl("2623684696"),
				},
				{
					name: "hejiehao",
					nameAliases: ["何杰豪", "hejiehao"],
					avatar: generateAvatarUrl("hejiehao"),
				},
				{
					name: "Rovniced",
					nameAliases: ["Rovniced", "Enlysure"],
					avatar: generateAvatarUrl("Rovniced"),
				},
				{
					name: "zyxkad",
					nameAliases: ["zyxkad", "Kevin Z"],
					avatar: generateAvatarUrl("zyxkad"),
				},
				{
					name: "HRxiaohu",
					nameAliases: ["HRxiaohu"],
					avatar: generateAvatarUrl("HRxiaohu"),
				},
				{
					name: "Pysio",
					nameAliases: ["pysio2007", "Pysio"],
					avatar: generateAvatarUrl("pysio2007"),
				},
				{
					name: "XieXiLin",
					nameAliases: ["XieXiLin", "XieXiLin2"],
					avatar: generateAvatarUrl("XieXiLin2"),
				},
				{
					name: "Z_Tsin",
					nameAliases: ["Z_Tsin", "ztsinsun"],
					avatar: generateAvatarUrl("ztsinsun"),
				},
				{
					name: "9Bakabaka",
					nameAliases: ["9Bakabaka"],
					avatar: generateAvatarUrl("9Bakabaka"),
				},
				{
					name: "ZhuRuoLing",
					nameAliases: ["ZhuRuoLing"],
					avatar: generateAvatarUrl("ZhuRuoLing"),
				},
				{
					name: "bingxin666",
					nameAliases: ["bingxin666"],
					avatar: generateAvatarUrl("bingxin666"),
				},
				{
					name: "zkitefly",
					nameAliases: ["zkitefly"],
					avatar: generateAvatarUrl("zkitefly"),
				},
				{
					name: "思遥方",
					nameAliases: ["Seayay", "思遥方"],
					avatar: generateAvatarUrl("Seayay"),
				},
			],
		})
		// Why it doesn't work?
		// const layouts = import.meta.glob("./layouts/*.vue")
		// for (const path in layouts) {
		// 	const layout = layouts[path].default
		// 	ctx.app.component(layout.name, layout)
		// }
	},
	setup(): void {
		// Get frontmatter and route
		const { frontmatter } = useData()
		const route = useRoute()
		// Using
		imageViewer(route)
		codeblocksFold({ route, frontmatter }, true, 400)

		// Obtain configuration from: https://giscus.app/
		giscusTalk(
			{
				repo: "GlobeMC/crashmc.com",
				repoId: "R_kgDOKBR8xw",
				category: "Giscus",
				categoryId: "DIC_kwDOKBR8x84CYOmB",
				mapping: "title",
				strict: "0",
				reactionsEnabled: "1",
				emitMetadata: "0",
				inputPosition: "top",
				theme: "preferred_color_scheme",
				lang: "zh-CN",
				loading: "lazy",
			},
			{
				frontmatter,
				route,
			},
		)
	},
}
