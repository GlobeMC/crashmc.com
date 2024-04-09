import type { EnhanceAppContext } from "vitepress"
import { useData, useRoute } from "vitepress"
import Theme from "vitepress/theme"
import { h } from "vue"

// Layouts
import Layout from "./Layout.vue"

// Components
import LauncherBadge from "./global-components/LauncherBadge.vue"
import Contributors from "./components/Contributors.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"

// Plugins
import giscusTalk from "vitepress-plugin-comment-with-giscus"
import vitepressNprogress from "@andatoshiki/vitepress-plugin-nprogress"
import imageViewer from "vitepress-plugin-image-viewer"
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue"
import codeblocksFold from "vitepress-plugin-codeblocks-fold" // import method
import vitepressBackToTop from "vitepress-plugin-back-to-top"

// Styles
import "./style.css"
import "vitepress-plugin-back-to-top/dist/style.css"
import "vitepress-plugin-codeblocks-fold/style/index.scss"
import "@andatoshiki/vitepress-plugin-nprogress/lib/css/index.css"
import "viewerjs/dist/viewer.min.css"

export default {
	extends: Theme,
	Layout: () => {
		return h(Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"doc-footer-before": () => h(Contributors),
			"layout-bottom": () => h(ReloadPrompt),
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
