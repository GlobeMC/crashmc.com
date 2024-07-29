import { fileURLToPath } from "node:url"
import {
	GitChangelog,
	GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog"

import authors from "@data/authors.json"

function generateAvatarUrl(username: string) {
	return `https://cdn.crashmc.com/https://github.com/${username}.png`
}

const viteConfig = {
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("../../", import.meta.url)),
			"@theme": fileURLToPath(new URL("../", import.meta.url)),
			"@data": fileURLToPath(new URL("../../data", import.meta.url)),
		},
	},
	plugins: [
		GitChangelog({
			repoURL: () => "https://github.com/GlobeMC/crashmc.com",
			mapAuthors: authors.map((author) => ({
				...author,
				avatar: generateAvatarUrl(author.avatar),
			})),
		}),
		GitChangelogMarkdownSection(),
	],
	optimizeDeps: {
		include: [
			// @rive-app/canvas is a CJS/UMD module, so it needs to be included here
			// for Vite to properly bundle it.
			"@nolebase/vitepress-plugin-enhanced-readabilities > @nolebase/ui > @rive-app/canvas",
		],
		exclude: ["@nolebase/vitepress-plugin-enhanced-readabilities/client"],
	},
	ssr: {
		noExternal: [
			// 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
			"@nolebase/vitepress-plugin-enhanced-readabilities",
			"@nolebase/vitepress-plugin-inline-link-preview",
		],
	},
}

export default viteConfig
