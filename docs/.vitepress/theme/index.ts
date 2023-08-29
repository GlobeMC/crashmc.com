import Theme from "vitepress/theme"
import { h } from "vue"
import Contributors from "./components/Contributors.vue"
import LauncherBadge from "./components/LauncherBadge.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"
import giscusTalk from "vitepress-plugin-comment-with-giscus"
import { useData, useRoute } from "vitepress"
import "./style.css"

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-footer-before": () => h(Contributors),
      "layout-bottom": () => h(ReloadPrompt),
    })
  },
  enhanceApp(ctx) {
    ctx.app.component("LauncherBadge", LauncherBadge)
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData()
    const route = useRoute()

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
