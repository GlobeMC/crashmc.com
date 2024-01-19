import type { EnhanceAppContext } from "vitepress"
import Theme from "vitepress/theme"
import { h } from "vue"
import Contributors from "./components/Contributors.vue"
import LauncherBadge from "./components/LauncherBadge.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"
import giscusTalk from "vitepress-plugin-comment-with-giscus"
import vitepressNprogress from "@andatoshiki/vitepress-plugin-nprogress"
import "@andatoshiki/vitepress-plugin-nprogress/lib/css/index.css"
import "viewerjs/dist/viewer.min.css"
import imageViewer from "vitepress-plugin-image-viewer"
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue"
import { useData, useRoute } from "vitepress"
import codeblocksFold from "vitepress-plugin-codeblocks-fold" // import method
import "vitepress-plugin-codeblocks-fold/style/index.scss" // import style
import "./style.css"
import vitepressBackToTop from "vitepress-plugin-back-to-top"
import "vitepress-plugin-back-to-top/dist/style.css"

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-footer-before": () => h(Contributors),
      "layout-bottom": () => h(ReloadPrompt),
    })
  },
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.component("LauncherBadge", LauncherBadge)
    vitepressNprogress(ctx)
    ctx.app.component("vImageViewer", vImageViewer)
    vitepressBackToTop({
      // default
      threshold: 300,
    })
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
