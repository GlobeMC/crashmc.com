import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GlobeMC",
  lang: "zh-CN",
  lastUpdated: true,
  description: "为一般玩家编写的 Minecraft 崩溃分析指南",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: "最后更新",
    },
    outlineTitle: "目录",
    logo: "/logo-brand.png",
    nav: [
      { text: "主页", link: "/" },
      { text: "客户端崩溃", link: "/clients" },
      { text: "服务器崩溃", link: "/servers" },
      { text: "贡献指南", link: "/contributing" },
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/GlobeMC/crashmc.com/blob/main/LICENSE">GFDL License</a>.',
      copyright:
        'Copyright © 2023-present <a href="https://github.com/GlobeMC">GlobeMC / 河豚分析</a>',
    },

    search: {
      provider: "local",
      options: {},
    },

    sidebar: [
      {
        text: "文档",
        items: [
          { text: "客户端崩溃", link: "/clients" },
          { text: "服务端崩溃", link: "/servers" },
          { text: "Mixin", link: "/mixin" },
        ],
      },
      {
        text: "贡献",
        items: [
          { text: "贡献指南", link: "/contributing" },
          { text: "团队", link: "/team" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/GlobeMC" }],

    editLink: {
      pattern: "https://github.com/GlobeMC/crashmc.com/edit/main/docs/:path",
      text: "在 GitHub 上帮助我们完善这个页面",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    externalLinkIcon: true,
  },

  head: [
    [
      "link",
      { rel: "icon", href: "/logo-brand.png" },
      // would render:
      //
      // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ],
  ],
});
