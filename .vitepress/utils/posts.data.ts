import { createContentLoader } from "vitepress"

interface Post {
	title: string
	url: string
	date: string
	excerpt: string | undefined
}
declare const data: Post[]
export { data }

export default createContentLoader("blog/*.md", {
	// Options
	excerpt: true,
	transform(raw): Post[] {
		return raw.map(({ url, frontmatter, excerpt }) => ({
			title: frontmatter.title,
			url,
			date: frontmatter.date,
			excerpt,
		}))
	},
})
