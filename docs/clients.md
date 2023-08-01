<script setup>
import LauncherBadge from '../components/LauncherBadge.vue'
</script>

# 客户端崩溃

## 在此之前...

本文档是为第三方启动器进行最佳优化的。如果您正在使用 **官方启动器**（Minecraft Launcher），我们建议您尝试使用 **第三方启动器** 以复现问题并进行排查。通常情况下，第三方启动器更适合进行 Mod 相关调试。

:::tip 提示
常见的第三方启动器的官网：

HMCL: https://hmcl.huangyuhui.net

PCL2: https://afdian.net/a/LTCat

BakaXL: https://www.BakaXL.com
:::

**请确保您能够复现崩溃**，并找到 `.minecraft\versions\<实例名称>\logs\latest.log` 文件（如果未启用版本隔离，则为 `.minecraft\logs\latest.log`），开始分析其中的内容。

在下文中，我们可能会提供一系列关键词。您可以定位到 Log 文件中最后一串 Traceback（以许多 at 开头的行）的前一行，选中并复制从 `java.` 开始到最后。然后使用 Ctrl + F 快捷键进行检索，或者将关键词复制到日志文件中进行检索。请注意，原则上每次只查询一行日志，不建议同时复制和查询多行。

如果您的游戏因为未响应而崩溃，我们暂时没有办法解决 :(

## 说明及名词解释

`Forge`、`NeoForge`、`Fabric`、`Quilt`、`LiteLoader` 均为 Mod 加载器，绝大多数的崩溃和 Mod 安装不正确有关。

`OptiFine`*(高清修复)* 是一个 Mod，它可以提高游戏的帧率，减少游戏的卡顿和延迟，并提供更多的图像设置。不正确的使用此 Mod 很容易导致崩溃，不建议和多个优化 Mods 同时安装。

`Java` 是 Minecraft *(我的世界)* 启动所必须的环境。在 1.16 及之前的版本推荐使用 Java 8。在 1.17 及以后的版本，需要使用 Java 17 及更高的版本。

## 常见问题

### OpenGL 错误

解释：该问题在任何情况均可能会出现，此处只考虑错误码出现在聊天栏的情况。

| 错误码 | 可能原因                          | 解决方法                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------ |
| 1280   | OptiFine / Mods 冲突 / OpenGL 版本错误 | 更换 OptiFine 版本、检查 Mods 冲突或尝试更新显卡驱动           |
| 1281   | Mods / 图像设置 / 显卡驱动 / 光影       | 尝试更新显卡驱动或检查 Mods 问题(如检查后无问题,则暂时无解)    |
| 1282   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换游戏版本、更换 OptiFine 版本、检查 Mods 问题或更换显卡驱动 |
| 1283   | Mods                              | 更换光影或检查 Mods 问题                                       |
| 1284   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换光影或检查 Mods 问题                                       |
| 1285   | 配置文件冲突 / 内存不足 / Mods 冲突    | 给游戏分配更多的内存或尝试重新安装游戏                       |
| 1286   | 内存溢出 / 显卡驱动                 | 给游戏分配更多的内存或尝试更新显卡驱动                       |

### 驱动问题

日志

```
Incorrect key [earlyWindowSkipGLVersions] was corrected from null to []
Incorrect key [earlyWindowSquir] was corrected from null to false
```

解决方法：

请检查您的驱动是否为最新


驱动下载：[Intel](https://www.intel.cn/content/www/cn/zh/download-center/home.html) | [AMD](https://www.amd.com/zh-hans/support) | [Nvidia](https://www.nvidia.cn/geforce/drivers/)

## 原版游戏

> 以下的原版游戏皆指 **未安装 OptiFine 或者 Mod 加载器等修改原版核心工具** 的 Minecraft 游戏实例。

在处理原版崩溃之前，需要注意的是 Mojang 几乎完全没有可能写一个 100% 会爆炸的东西出来然后推送到正式版。因此 99% 的原版崩溃问题都来自外界。

首先请确保已经打开了启动器的 **自动决定 Java** 功能，否则可能会因为使用的 Java 版本错误而导致启动失败。

如果你是在安装一个新的 MC 版本之后发生了崩溃，那么请确保你的网络连接良好，然后前往启动器内使用 **补全文件** 功能。

附常用启动器补全功能位置：

BakaXL：核心列表 -> 点击核心 -> 高级核心管理 -> 恢复 / 删除 -> 重置此核心

HMCL：点击左边的实例名称 -> 管理 -> 更新游戏资源文件

PCL2：版本设置 -> 补全文件

如果你在启动游戏时弹出了 **含有 OpenGL 字样** 的英文弹窗，请前往你使用的显卡官网下载对应你显卡的最新驱动并安装。如果你使用的是 3 代及以前的 Intel 核显，则理论上无法游玩任何需要 Java 17 的版本。你也可以尝试使用软渲染器<LauncherBadge type="hmcl" text="仅 HMCL" />（在 `游戏特定设置` -> `高级设置` -> `渲染器` 里修改），但这可能会严重降低游戏性能。

如果你正在游玩 1.16.5 或以下版本，请 [下载 Java 8u51](https://ghproxy.com/https://github.com/frekele/oracle-java/releases/download/8u51-b16/jre-8u51-windows-x64.exe) 并安装，然后使用该 Java 启动游戏。

#### 存档损坏

日志

```
Exception reading *\level.dat
Caused by: java.util.zip.ZipException: invalid distance too far back
net.minecraft.util.crash.CrashException: Loading NBT data
```

解决方法：

换一个存档

## 安装了 Mod 或是 Mod 加载器（Mod Loader）的游戏

### 常见问题

#### Java 版本不匹配

解释：有些时候一些 Mod 会要求特殊的 Java 版本，比如 Java 11 。此时使用不正确的 Java 版本将无法启动游戏。

:::warning 注意
除非你匹配到了示例中的关键词，否则我们始终建议保持启动器的 **自动决定 Java** 功能为开启状态。
:::

解决方案：根据 Log 引导使用正确的 Java 版本启动游戏。检查括号内的 `class file version` 后跟随的数字，然后在 Java 版本列表里查找对应的 Java 大版本。

```
// 示例中是因为使用的 Java 与 Minecraft 要求的 Java 版本不符导致崩溃，应当使用 Java 17 
// 因为安装了 Mod 导致崩溃时， net/minecraft/client/main/Main 部分会改变
// 因此建议只检索 java.lang.UnsupportedClassVersionError 部分
java.lang.UnsupportedClassVersionError: net/minecraft/client/main/Main has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0
```

| 日志                                                   | 解决方案                            |
| ------------------------------------------------------ | ----------------------------------- |
| `no such method: sun.misc.Unsafe.defineAnonymousClass` | Java 版本过高，降低 Java 版本至 17 以下 |

附 Java 版本查询列表

:::details Java 版本查询列表
| Java 大版本 | Class File Version |
|------------|--------------------|
| Java 20    | 64                 |
| Java 19    | 63                 |
| Java 18    | 62                 |
| Java 17    | 61                 |
| Java 16    | 60                 |
| Java 15    | 59                 |
| Java 14    | 58                 |
| Java 13    | 57                 |
| Java 12    | 56                 |
| Java 11    | 55                 |
| Java 10    | 54                 |
| Java  9    | 53                 |
| Java  8    | 52                 |
| Java  7    | 51                 |
:::

### Forge

#### 系统问题

##### Mac 下存在 .DS_Store 文件夹报错

```
Caused by: net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
```

解决方法：

删除掉 `.DS_Store` 文件夹

##### 不兼容 Mac 的 Mod

```
Exception caught during firing event: Unable to load library 'imm32':
class io.github.reserveword.imblocker.IMBlocker$RegistryEvents
```

解决方法：

删除掉 `IMBlocker` 模组（此模组仅适用于 Windows）

##### Mac 下初始化 OpenGL 窗口问题

```
java.lang.IllegalStateException: GLFW error before init: [0x10008]Cocoa: Failed to find service port for display
```

解决方法：（不保证可行）

先开一个浏览器全屏，然后启动游戏，在还没弹出窗口的时候迅速切回浏览器，等差不多游戏窗口出来了之后再切回去。

### NeoForge

### Fabric

#### 缺少前置

解释：有 Mod 依赖其他 Mod 运行，但未安装依赖的 Mod

解决方法：

1. 安装依赖 Mod

在 `Unmet dependency listing` 中找到 `requires` 字样，然后根据后面提示的 Mod 信息查找对应 Mod 并下载安装。

如果一个 Mod 要求特定版本的另一个 Mod ，那么你应当寻找符合要求的 Mod 版本。

相关英文提示： any -> 任何 ； version -> 版本 ； require(s) -> 要求，需要 ； of -> 的（介词）

```
// 在示例中，您应该安装 Zoomify Mod 的前置 Mod：Fabric API。
Unmet dependency listing:
	 - Mod 'Zoomify' (zoomify) 2.11.0 requires any version of fabric-api, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索 Mods 所需的前置 Mods。

> Modrinth 和 CurseForge 目前为止未提供中文界面，有困难的用户建议使用 MC 百科 进行查询。

2. 删除需要前置的 Mod

在 `Unmet dependency listing` 中找到 `requires` 字样，然后根据前面提示的 Mod 信息删除对应 Mod。

```
// 在示例中，您应该删除 Zoomify Mod。
Unmet dependency listing:
	 - Mod 'Zoomify' (zoomify) 2.11.0 requires any version of fabric-api, which is missing!
```

关键词

```
net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!

which is missing!
```

### Quilt


#### 缺少前置

解释：有 Mod 依赖其他 Mod 运行，但未安装依赖的 Mod

解决方法：

1. 安装依赖 Mod

在 `Unmet dependency listing` 中找到 `requires` 字样，然后根据后面提示的 Mod 信息查找对应 Mod 并下载安装。

如果一个 Mod 要求特定版本的另一个 Mod ，那么你应当寻找符合要求的 Mod 版本。在 Quilt 中，括号中的前面一串数字代表最低版本，后面一串数字代表最高版本。

相关英文提示： any -> 任何 ； version -> 版本 ； require(s) -> 要求，需要 ； of -> 的（介词）

```
// 在示例中，您应该安装 Sodium Extra Mod 的前置 Mod：Sodium。
Sodium Extra requires version [0.4.10, ∞) of sodium, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索 Mods 所需的前置 Mods。

> Modrinth 和 CurseForge 目前为止未提供中文界面，有困难的用户建议使用 MC 百科 进行查询。

2. 删除需要前置的 Mod

在 `Unmet dependency listing` 中找到 `requires` 字样，然后根据前面提示的 Mod 信息删除对应 Mod。

```
// 在示例中，您应该删除 Sodium Extra Mod。
Sodium Extra requires version [0.4.10, ∞) of sodium, which is missing!
```

关键词

```
which is missing!
```

### LiteLoader

### OptiFine


#### Forge 与 OptiFine 兼容性问题导致的崩溃

解释：使用的 Forge 版本过高 / 过低 或 OptiFine 并未兼容该版本的 Forge ，导致游戏崩溃。

解决方案：前往 [OptiFine 官网](https://optifine.net/downloads) ，按照提示安装对应的 Forge 版本。

提示：

- 点击 `Show all versions` 即可展开所有的游戏版本，点击 `+ More` 和 `+ Preview versions` 可展开更多

- 若显示 `Forge N/A` 则代表该版本的 OptiFine 不兼容任何 Forge 版本


你可以复制下面的关键词，然后在日志中查找是否有匹配，以确定是否是该原因导致崩溃（关键词仅供参考）

```
java.lang.NoSuchMethodError: 'java.lang.Class sun.misc.Unsafe.defineAnonymousClass(java.lang.Class, byte[], java.lang.Object[])'

java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'

java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'

java.lang.NoSuchMethodError: 'net.minecraft.network.chat.FormattedText net.minecraft.client.gui.Font.ellipsize(net.minecraft.network.chat.FormattedText, int)'

java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager

java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.block.model.BakedQuad.<init>(int[], int, net.minecraft.core.Direction, net.minecraft.client.renderer.texture.TextureAtlasSprite, boolean, boolean)'

TRANSFORMER/net.optifine/net.optifine.reflect.Reflector.<clinit>(Reflector.java
```
