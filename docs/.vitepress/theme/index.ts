import Theme from "vitepress/theme"
import { h } from "vue"
import Comment from "./components/Comment.vue"
import Contributors from "./components/Contributors.vue"
import LauncherBadge from "./components/LauncherBadge.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"
import "./style.css"

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-after": () => h(Comment),
      "doc-footer-before": () => h(Contributors),
      "layout-bottom": () => h(ReloadPrompt),
    })
  },
  enhanceApp(ctx) {
    ctx.app.component("LauncherBadge", LauncherBadge)
  },
}
