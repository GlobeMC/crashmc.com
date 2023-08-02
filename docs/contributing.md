<script setup>
import LauncherBadge from '../components/LauncherBadge.vue'
</script>

# 贡献指南

## 排版标准

请先 Fork 本仓库，然后进行文档修改。排版时请务必遵循中文文案排版指北。

请注意：在非 Log 信息以外的任何地方，如果有中文和英文数字混用，请在中文和英文数字之间添加空格；如果有斜杠的，请在斜杠两边增加一个空格。

例：`GlobeMC 河豚分析是一个 2023 年 7 月底成立的崩溃日志分析组织，以方便 / 开放 / 专业为目标`

在涉及非 Log 信息以外的任何地方，英文单词原则上首字母大写，部分情况需要按照规则大写，英文句子首字母大写。

例：`Minecraft`、`OptiFine`、`What your love is your life`。

在涉及路径时，请在路径的前后加上空格。

例：`路径 D:/PCL/.minecraft/mods 是存放 Mods 的地方`

在涉及任何站外链接时，请优先添加官方链接，尽量避免不必要的第三方链接。

如果某一个解决方案为特定启动器独占功能，请使用 Vue Component 注明。示例如下：

:::warning 警告
在使用 Component 之前，请务必在 Markdown 最顶部引入它。
```vue
<script setup>
import LauncherBadge from '../components/LauncherBadge.vue'
</script>
```
:::

:::details HMCL
### 修改渲染器 <LauncherBadge type="hmcl" text="仅 HMCL" />

```md
### 修改渲染器 <LauncherBadge type="hmcl" text="仅 HMCL" />
```
:::

:::details BakaXL
### 重置核心 <LauncherBadge type="bakaxl" text="仅 BakaXL" />

```md
### 重置核心 <LauncherBadge type="bakaxl" text="仅 BakaXL" />
```
:::

:::details PCL2
### 修改验证服务器 <LauncherBadge type="pcl" text="仅 PCL2" />

```md
### 修改验证服务器 <LauncherBadge type="pcl" text="仅 PCL2" />
```
:::