import { h } from "vue"
import Theme from "vitepress/theme"
import "./style.css"
import Comment from "./components/comment.vue"
import Author from "./components/Author.vue"
import ReloadPrompt from "./components/ReloadPrompt.vue"
import LauncherBadge from "./globalComponents/LauncherBadge.vue"

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-after": () => h(Comment),
      "doc-footer-before": () => h(Author),
      "layout-bottom": () => h(ReloadPrompt),
    })
  },
  enhanceApp(ctx) {
    ctx.app.component("LauncherBadge", LauncherBadge)
  },
}
