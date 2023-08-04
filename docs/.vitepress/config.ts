import { withPwa } from "@vite-pwa/vitepress";
import process from "node:process";
import { defineConfig } from "vitepress";
import { pwa } from "./scripts/pwa";

const COMMIT_ID = process.env.CF_PAGES_COMMIT_SHA || process.env.COMMIT_REF;
const commitRef = COMMIT_ID?.slice(0, 8);

export default withPwa(
  defineConfig({
    title: "GlobeMC",
    lang: "zh-CN",
    lastUpdated: true,
    description: "为一般玩家编写的 Minecraft 崩溃分析指南",
    themeConfig: {
      lastUpdated: {
        text: "最后更新",
      },
      outlineTitle: "目录",
      logo: "/logo-brand.png",
      nav: [
        { text: "主页", link: "/" },
        { text: "崩溃分析工具", link: "/analyzer" },
        { text: "基础知识", link: "/basis" },
        { text: "客户端崩溃", link: "/clients" },
        { text: "服务器崩溃", link: "/servers" },
        { text: "贡献指南", link: "/contributing" },
      ],

      footer: {
        message: `Released under the <a href="https://github.com/GlobeMC/crashmc.com/blob/main/LICENSE">GFDL License</a>.<br />GlobeMC/crashmc.com<br />prod@<a href="https://github.com/GlobeMC/crashmc.com/commit/${commitRef}" target="_blank" alt=${commitRef}>${commitRef}</a>`,
        copyright:
          'Copyright © 2023-present <a href="https://github.com/GlobeMC">GlobeMC / 河豚分析</a>',
      },

      search: {
        provider: "algolia",
        options: {
          appId: "A163FFFXG6",
          apiKey: "a8c4a4fedda9caccaed0b99fa4d7999e",
          indexName: "crashmc",
          placeholder: "搜索文档",
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              searchBox: {
                resetButtonTitle: "清除查询条件",
                resetButtonAriaLabel: "清除查询条件",
                cancelButtonText: "取消",
                cancelButtonAriaLabel: "取消",
              },
              startScreen: {
                recentSearchesTitle: "搜索历史",
                noRecentSearchesText: "没有搜索历史",
                saveRecentSearchButtonTitle: "保存至搜索历史",
                removeRecentSearchButtonTitle: "从搜索历史中移除",
                favoriteSearchesTitle: "收藏",
                removeFavoriteSearchButtonTitle: "从收藏中移除",
              },
              errorScreen: {
                titleText: "无法获取结果",
                helpText: "你可能需要检查你的网络连接",
              },
              footer: {
                selectText: "选择",
                navigateText: "切换",
                closeText: "关闭",
                searchByText: "搜索提供者",
              },
              noResultsScreen: {
                noResultsText: "无法找到相关结果",
                suggestedQueryText: "你可以尝试查询",
                reportMissingResultsText: "你认为该查询应该有结果？",
                reportMissingResultsLinkText: "点击反馈",
              },
            },
          },
        },
      },

      sidebar: [
        {
          text: "文档",
          items: [
            { text: "崩溃分析工具", link: "/analyzer" },
            { text: "基础知识", link: "/basis" },
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
      darkModeSwitchLabel: "切换深色模式",
    },

    head: [
      ["link", { rel: "icon", href: "/logo-brand.png" }],
      [
        "script",
        {
          async: "",
          src: "https://umami.lihaoyu.cn/api.js",
          "data-website-id": "913a41bc-fd2c-479c-8594-8e507d81b07d",
        },
      ],
    ],

    pwa,
  })
);
