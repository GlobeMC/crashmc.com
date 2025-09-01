import type { MarkdownOptions } from "vitepress"
import { BiDirectionalLinks } from "@nolebase/markdown-it-bi-directional-links"
import { InlineLinkPreviewElementTransform } from "@nolebase/vitepress-plugin-inline-link-preview/markdown-it"

const markdownitConfig: MarkdownOptions = {
	image: {
		lazyLoading: true,
	},
	theme: {
		light: "material-theme-lighter",
		dark: "material-theme-palenight",
	},
	lineNumbers: true,
	config: (md) => {
		md.use(
			// @ts-expect-error Expected type error
			BiDirectionalLinks({
				dir: "docs",
				baseDir: "/",
			}),
		)
		// @ts-expect-error Expected type error
		md.use(InlineLinkPreviewElementTransform)
	},
}

export default markdownitConfig
