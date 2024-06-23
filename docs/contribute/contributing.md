---
contributors: [HRxiaohu, bingling-sama]
---

# 贡献指南

在向 CrashMC 贡献内容前，请务必仔细阅读以下贡献流程，以便我们进行代码审查工作。

## Step.1 克隆项目

首先 fork [GitHub 仓库](https://github.com/GlobeMC/crashmc.com) 到你名下，然后克隆仓库到本地：

```bash
# 推荐使用 SSH
git clone git@github.com:{yourname}/crashmc.com.git
# 也可以使用 HTTPS （不推荐）
git clone https://github.com/{yourname}/crashmc.com.git 
```

推荐使用 [VSCode](https://code.visualstudio.com/) 编辑内容，强烈建议安装工作区推荐扩展。

:::tip GitHub Web Editor
如果内容较少，你可以直接使用 [GitHub Web Editor](https://github.dev) 来进行修改。

但同样，你需要先将仓库 fork 你自己名下，以便后期进行 PR。
:::

## Step.2 贡献内容

### 文档内容

本文档按 [W3C Requirement for Chinese Text Layout](https://www.w3.org/International/clreq/) 进行排版，在贡献内容时请注意排版格式。

在涉及任何站外链接时，请优先添加官方链接，尽量避免不必要的第三方链接。

:::tip 提示
为了方便各位快速建立文档内页面的链接，我们已经为文档添加了双向链接支持。语法可以参考 [语法 | Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/markdown-it-bi-directional-links/syntax.html)。
:::

如果某一个解决方案为特定启动器独占功能，我们提供了全局组件来标注它。示例如下：

```markdown
<LauncherBadge type="hmcl" text="仅 HMCL" />
<LauncherBadge type="bakaxl" text="仅 BakaXL" />
<LauncherBadge type="pcl" text="仅 PCL2" />
```

实际效果：

- <LauncherBadge type="hmcl" text="仅 HMCL" />
- <LauncherBadge type="bakaxl" text="仅 BakaXL" />
- <LauncherBadge type="pcl" text="仅 PCL2" />

文档会自动记录每个页面的 Git 提交历史记录以及为此文件做过贡献的人员，并将这些信息显示在页面上。

:::warning 警告

- 如果在多次提交时使用的名称不一致会导致贡献者记录中出现多个记录，建议统一自己提交时使用的名称。
- 上述代码中所使用的均为**英文半角逗号**！

:::

### 代码内容

如果您参与了代码内容的修改，~~相信您应该多少懂一些贡献流程，~~ 这里不再过多赘述贡献流程。

## Step.3 提交更改

在完成内容编写以后，请将您的所有更改 commit 到您的 fork 下，再向 [这里](https://github.com/GlobeMC/crashmc.com/tree/dev) 提交 PR。

:::warning 重要提醒
请务必将您的更改 PR 到 `dev` barnch，以便我们审查排版及合并冲突。
:::

:::tip Assign
如果您的更改范围为文档相关，请 Assign `@bingling-sama`、`@xxx` 或 `@xxx`（一般来说请您按 Suggestion 进行请求即可），这会加快我们对您的代码审查与合并速度。
:::

## Step4.剩余流程

在收到您的 PR 后，我们会尽最快速度审查您的代码，并合并到 `dev` branch。

我们会每周进行一次例行 merge，将所有已完成的更改合并到生产环境 `main` branch，因此请不要将您的更改 PR 到 `main` branch，这会增大我们的代码审查和文档部署工作量。

## 其他提醒

如果要提交博客内容，请参考 [博客主页](https://crashmc.com/blog/) 的贡献指南。

## 鸣谢

感谢所有为 CrashMC 贡献内容的玩家和开发者，你们的支持是对 CrashMC 最大的鼓励。
