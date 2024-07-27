import type { EnhanceAppContext } from "vitepress/client"
import { useData } from "vitepress/client"
import { useRoute } from "vitepress/client"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"

// Components
import LauncherBadge from "./global-components/LauncherBadge.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"
import Posts from "./layouts/Posts.vue"
import Contributors from "./components/Contributors.vue"

// Plugins
import giscusTalk from "vitepress-plugin-comment-with-giscus"
import vitepressNprogress from "@andatoshiki/vitepress-plugin-nprogress"
import imageViewer from "vitepress-plugin-image-viewer"
// TODO: edit this after https://github.com/T-miracle/vitepress-plugin-image-viewer/issues/4 is fixed
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue"
import codeblocksFold from "vitepress-plugin-codeblocks-fold" // import method
import vitepressBackToTop from "vitepress-plugin-back-to-top"
import {
	NolebaseEnhancedReadabilitiesMenu,
	NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client"
import { NolebaseInlineLinkPreviewPlugin } from "@nolebase/vitepress-plugin-inline-link-preview/client"
import "@nolebase/vitepress-plugin-inline-link-preview/client/style.css"

// Styles
import "./style.css"
import "vitepress-plugin-back-to-top/dist/style.css"
import "vitepress-plugin-codeblocks-fold/style/index.scss"
import "@andatoshiki/vitepress-plugin-nprogress/lib/css/index.css"
import "viewerjs/dist/viewer.min.css"
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css"

// function generateAvatarUrl(username: string) {
// 	return `https://cdn.crashmc.com/https://github.com/${username}.png`
// }

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
			"doc-footer-before": () => h(Contributors),
		})
	},
	enhanceApp(ctx: EnhanceAppContext) {
		vitepressBackToTop({
			// default
			threshold: 300,
		})
		ctx.app.component("LauncherBadge", LauncherBadge)
		ctx.app.component("Posts", Posts)
		vitepressNprogress(ctx)
		ctx.app.component("vImageViewer", vImageViewer)
		ctx.app.use(NolebaseInlineLinkPreviewPlugin)
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
