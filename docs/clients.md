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

若在启动 BakaXL 或 PCL2 时出现了 .NET Framework 异常，请在 [此处](https://dotnet.microsoft.com/zh-cn/download/dotnet-framework/thank-you/net48-offline-installer) 下载安装 .NET Framework 4.8。
:::

**请确保您能够复现崩溃**，并找到 `.minecraft\versions\<实例名称>\logs\latest.log` 文件（如果未启用版本隔离，则为 `.minecraft\logs\latest.log`），开始分析其中的内容。

在下文中，我们可能会提供一系列关键词。您可以定位到 Log 文件中最后一串 Traceback（以许多 at 开头的行）的前一行，选中并复制从 `java.` 开始到最后。然后使用 Ctrl + F 快捷键进行检索，或者将关键词复制到日志文件中进行检索。请注意，原则上每次只查询一行日志，不建议同时复制和查询多行。

如果您的游戏因为未响应而崩溃，我们暂时没有办法解决 :(

:::warning 注意
本文档主要针对 Windows 7 及以上版本 和 macOS 10.10 及以上版本编写。

如果您是使用 Windows XP / Windows Vista / Linux 的极客用户，我们不一定提供相关参考，文中方案也不一定适用于您的系统环境，由此带来的任何问题请您发扬极客精神自行解决。

**本文档所提供的方案仅供参考，您操作造成的问题由您自行承担！**

**本文档所提供的方案仅供参考，您操作造成的问题由您自行承担！！**

**本文档所提供的方案仅供参考，您操作造成的问题由您自行承担！！！**
:::

## 说明及名词解释

`Forge`、`NeoForge`、`Fabric`、`Quilt`、`LiteLoader` 均为 Mod 加载器，绝大多数的崩溃和 Mod 安装不正确有关。

`OptiFine`*(高清修复)* 是一个 Mod，它可以提高游戏的帧率，减少游戏的卡顿和延迟，并提供更多的图像设置。不正确的使用此 Mod 很容易导致崩溃，不建议和多个优化 Mods 同时安装。

`Java` 是 Minecraft *(我的世界)* 启动所必须的环境。在 1.16 及之前的版本推荐使用 Java 8。在 1.17 及以后的版本，需要使用 Java 17 及更高的版本。

## 通用常见问题

### OpenGL 错误（聊天栏中出现）

| 错误码 | 可能原因                          | 解决方法                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------ |
| 1280   | OptiFine / Mods 冲突 / OpenGL 版本错误 | 更换 OptiFine 版本、检查 Mods 冲突或尝试更新显卡驱动           |
| 1281   | Mods / 图像设置 / 显卡驱动 / 光影       | 尝试更新显卡驱动或检查 Mods 问题(如检查后无问题,则暂时无解)    |
| 1282   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换游戏版本，更换 OptiFine 版本，检查 Mods 问题，检查材质包和光影包，或更换显卡驱动 |
| 1283   | Mods                              | 更换光影或检查 Mods 问题                                       |
| 1284   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换光影或检查 Mods 问题                                       |
| 1285   | 配置文件冲突 / 内存不足 / Mods 冲突    | 给游戏分配更多的内存或尝试重新安装游戏                       |
| 1286   | 内存溢出 / 显卡驱动                 | 给游戏分配更多的内存或尝试更新显卡驱动                       |

### 显卡 / 显卡驱动问题

解释：因为你的显卡配置或显卡驱动存在问题，游戏无法正常运行。

解决方法：检查显卡驱动是否为最新；如果有独立显卡的请使用独立显卡运行游戏，而非核显。

驱动下载：[Intel](https://www.intel.cn/content/www/cn/zh/download-center/home.html) | [AMD](https://www.amd.com/zh-hans/support) | [Nvidia](https://www.nvidia.cn/geforce/drivers/)

关键词：

```
// 显卡驱动问题
Incorrect key [earlyWindowSkipGLVersions] was corrected from null to []
Incorrect key [earlyWindowSquir] was corrected from null to false
// 显卡驱动 / 显卡配置问题
Couldn't set pixel format
Pixel format not accelerated
The driver does not appear to support OpenGL
```

### 内存问题

解释：由于内存不足，游戏无法继续运行。

解决方案：检查游戏分配的内存大小；尽可能关闭系统内运行的其他程序，然后再次启动游戏。

内存清理 <LauncherBadge type="bakaxl" text="BakaXL" /> ：前往 `本体设置 - Java 虚拟机与内存` ，确保 `自动设置内存` 设置为开，然后展开 `内存高级设置` ，点击 `强制释放内存` （可多次点击），然后再次启动游戏。

内存优化 <LauncherBadge type="pcl" text="PCL2" /> ：前往 `设置 - 游戏 - 游戏内存` ，确保内存配置选项为 `自动配置` 。然后前往 `更多 - 百宝箱` ，点击 `内存优化` ，然后按照提示给予启动器管理员权限，等待内存优化完成后再次启动游戏。

关键词：

```
java.lang.OutOfMemoryError
Could not reserve enough space
```

### Java 问题

请在排查错误之前先打开启动器的 **自动决定 Java** 功能，然后再尝试启动游戏复现问题。在通常情况下，你不应该关闭这个功能。

以下为几个常见的因为 Java 的**非版本问题**导致的错误。

#### 使用 OpenJ9

解释：游戏因为使用 OpenJ9 而崩溃了。

解决方案：卸载当前 Java ，然后前往其他地方获取一个非 OpenJ9 的 Java。

:::details 常见的第三方启动器获取 Java 方法
在<LauncherBadge type="bakaxl" text="BakaXL" />启动器设置中获取 Java：前往 `本体设置 - Java 虚拟机与内存` ，点击获取对应的 Java 版本。

在<LauncherBadge type="pcl" text="PCL2" />启动器中获取 Java：卸载当前 Java 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在<LauncherBadge type="hmcl" text="HMCL" />启动器中获取 Java：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。
:::

关键词：

```
Open J9 is not supported
OpenJ9 is incompatible
.J9VMInternals.
```

#### 使用了 32 位 Java 且分配内存过大

解释：由于使用了 32 位 Java 且分配了 1G 以上内存，导致游戏无法正常启动。

解决方法：

1.
:::warning 注意
此方法仅适用于 64 位系统。
:::
卸载当前 Java ，然后去其他地方重新获取 64 位的 Java。

:::details 常见的第三方启动器获取 Java 方法
在<LauncherBadge type="bakaxl" text="BakaXL" />启动器设置中获取 Java：前往 `本体设置 - Java 虚拟机与内存` ，点击获取对应的 Java 版本。

在<LauncherBadge type="pcl" text="PCL2" />启动器中获取 Java：卸载当前 Java 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在<LauncherBadge type="hmcl" text="HMCL" />启动器中获取 Java：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。
:::

2.
:::warning 注意
不推荐使用此方法，可能会导致游戏卡顿，但 32 位系统只能这么做。
:::
在启动器的内存设置中调整游戏内存分配至小于等于 1G （1G = 1024M）。

3.
:::warning 注意
需要一定技术基础，适用于 32 位系统，但为 64 位处理器。
:::
自行重装系统为 64 位。你可以使用微软官方提供的重装工具，抑或是使用 `EasyRC 一键重装` 等无捆绑一键重装工具。

关键词：

```
Could not reserve enough space for 1048576KB object heap
```

## 原版问题

> 该板块内容也适用于安装了 Mod 加载器或 Mod 的游戏实例。

> 以下的原版游戏皆指 **未安装 OptiFine 或者 Mod 加载器等修改原版核心工具** 的 Minecraft 游戏实例。

在处理原版崩溃之前，需要注意的是 Mojang 几乎完全没有可能写一个 100% 会爆炸的东西出来然后推送到正式版。因此 99% 的原版崩溃问题都来自外界。

首先请确保已经打开了启动器的 **自动决定 Java** 功能，否则可能会因为使用的 Java 版本错误而导致启动失败。

如果你是在安装一个新的 MC 版本之后发生了崩溃，那么请确保你的网络连接良好，然后前往启动器内使用 **补全文件** 功能。

:::tip 提示
附常用启动器补全功能位置：

重置核心 <LauncherBadge type="bakaxl" text="BakaXL" /> ：核心列表 -> 点击核心 -> 高级核心管理 -> 恢复 / 删除 -> 重置此核心

更新游戏资源文件 <LauncherBadge type="hmcl" text="HMCL" /> ：点击左边的实例名称 -> 管理 -> 更新游戏资源文件

补全文件 <LauncherBadge type="pcl" text="PCL2" /> ：版本设置 -> 补全文件
:::

如果你在启动游戏时弹出了 **含有 OpenGL 字样** 的英文弹窗，请前往你使用的显卡官网下载对应你显卡的最新驱动并安装。如果你使用的是 3 代及以前的 Intel 核显，则理论上无法游玩任何需要 Java 17 的版本。你也可以尝试使用软渲染器<LauncherBadge type="hmcl" text="仅 HMCL" />（在 `游戏特定设置` -> `高级设置` -> `渲染器` 里修改），但这可能会严重降低游戏性能。

如果你正在游玩 1.16.5 或以下版本，请 [下载 Java 8u51](https://ghproxy.com/https://github.com/frekele/oracle-java/releases/download/8u51-b16/jre-8u51-windows-x64.exe) 并安装，然后使用该 Java 启动游戏。

#### 存档损坏

关键词

```
Exception reading *\level.dat
Caused by: java.util.zip.ZipException: invalid distance too far back
net.minecraft.util.crash.CrashException: Loading NBT data
```

解决方法：

换一个存档

#### 材质包过大

解释：由于材质包过大，或是你的显卡配置不足，导致游戏不能正常运行。

解决方案：使用更低分辨率的材质包，或者换个更好的显卡？

关键词：

```
Maybe try a lower resolution resourcepack?
```

### 文件校验失败

解释：由于部分游戏文件或资源校验失败，游戏无法正常启动。

解决方案：使用启动器补全文件，抑或是重新下载游戏。

:::tip 提示
附常用启动器补全功能位置：

重置核心 <LauncherBadge type="bakaxl" text="BakaXL" /> ：核心列表 -> 点击核心 -> 高级核心管理 -> 恢复 / 删除 -> 重置此核心

更新游戏资源文件 <LauncherBadge type="hmcl" text="HMCL" /> ：点击左边的实例名称 -> 管理 -> 更新游戏资源文件

补全文件 <LauncherBadge type="pcl" text="PCL2" /> ：版本设置 -> 补全文件
:::

关键词：

```
signer information does not match signer information of other classes in the same package
```

## 安装了 Mod 或是 Mod 加载器（Mod Loader）的游戏

### 常见问题

#### Java 问题

##### Java 版本不匹配

解释：有些时候一些 Mod 会要求特殊的 Java 版本，比如 Java 11。此时使用不正确的 Java 版本将无法启动游戏。

:::warning 注意
除非你匹配到了示例中的关键词，否则我们始终建议保持启动器的 **自动决定 Java** 功能为开启状态。
:::

解决方法：根据 Log 引导使用正确的 Java 版本启动游戏。检查括号内的 `class file version` 后跟随的数字，然后在 Java 版本列表里查找对应的 Java 大版本。

```
// 示例中是因为使用的 Java 与 Minecraft 要求的 Java 版本不符导致崩溃，应当使用 Java 17 
// 因为安装了 Mod 导致崩溃时， net/minecraft/client/main/Main 部分会改变
// 因此建议只检索 java.lang.UnsupportedClassVersionError 部分
java.lang.UnsupportedClassVersionError: net/minecraft/client/main/Main has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0

// 下列几种其他常见日志
java.lang.UnsupportedClassVersionError: net/fabricmc/loader/impl/launch/knot/KnotClient : Unsupported major.minor version
Unsupported class file major version
```

| 关键词                                                   | 解决方法                            |
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

##### 其他 Java 问题

解释：由于低版本 Forge 和高版本 Java 不兼容，导致了游戏崩溃。

解决方案：卸载当前 Java 8 ，然后前往其他地方获取版本号小于等于 8u312 且大于等于 8u51 的 Java 8。

在启动器设置中获取 Java <LauncherBadge type="bakaxl" text="BakaXL" /> ：前往 `本体设置 - Java 虚拟机与内存` ，点击 `获取 Java 8` 。

在启动器中获取 Java <LauncherBadge type="pcl" text="PCL2" /> ：卸载当前所有 Java 8 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在启动器中获取 Java <LauncherBadge type="hmcl" text="HMCL" /> ：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。

#### Mod 重复安装

解释：由于有 Mod 重复安装，导致游戏无法正常运行。

解决方案：排查重复的 Mod ，然后移除重复项直至只剩下一个该 Mod 文件。

关键词：

```
DuplicateModsFoundException
Found a duplicate mod
ModResolutionException: Duplicate
```

#### Mod 过多导致超出 ID 限制

解释：你所安装的 Mod 过多，超出了游戏的 ID 限制，导致游戏崩溃。

解决方案：请尝试安装 JEID 等修复 Mod，或删除部分大型 Mod。

关键词：

```
maximum id range exceeded
```

#### 解压了 Mod

解释：因为 Mod 文件被解压了，游戏无法继续运行。

解决方案：删除 Mods 文件夹中已被解压的 Mod ，然后重新获取被删除的 Mod。

关键词：

```
The directories below appear to be extracted jar files. Fix this before you continue.
Extracted mod jars found, loading will NOT continue
```

#### Mod 名称含有特殊字符

解释：由于 Mod 名称中含有特殊字符，游戏无法正常启动。

解决方案：删去 Mod 文件名中的特殊字符，然后再次启动游戏。

关键词：

```
Invalid module name: '' is not a Java identifier
```

### Forge

#### Json 问题

解释：可能由于使用一些启动器修改了 Forge 版本，当前实例的 Json 文件存在异常。

解决方案：

重新安装<LauncherBadge type="hmcl" text="HMCL" /> <LauncherBadge type="pcl" text="PCL2" /> <LauncherBadge type="bakaxl" text="BakaXL" />：请尝试重新全新安装 Forge，而非使用其他启动器修改 Forge 版本。

重置核心<LauncherBadge type="bakaxl" text="仅 BakaXL" /> ：前往 `核心列表 - 核心高级设置 - 恢复 / 删除 - 重置此核心` 尝试重置核心。

关键词：
```
Found multiple arguments for option fml.forgeVersion, but you asked for only one
```

#### 系统问题

##### Mac 下存在 .DS_Store 文件夹报错

```
Caused by: net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
```

解决方法：删除 `.DS_Store` 文件夹

##### 不兼容 Mac 的 Mod

```
Exception caught during firing event: Unable to load library 'imm32':
class io.github.reserveword.imblocker.IMBlocker$RegistryEvents
```

解决方法：删除 `IMBlocker` 模组（此模组仅适用于 Windows）

##### Mac 下初始化 OpenGL 窗口问题

```
java.lang.IllegalStateException: GLFW error before init: [0x10008]Cocoa: Failed to find service port for display
```

解决方法<Badge type="warning" text="实验性" />：先开一个浏览器全屏，然后启动游戏，在还没弹出窗口的时候迅速切回浏览器，等差不多游戏窗口出来了之后再切回去。

### NeoForge

### Fabric

#### 缺少前置

解释：有 Mod 依赖其他 Mod 运行，但未安装依赖的 Mod

解决方法：

1. 安装依赖 Mod

在 `Unmet dependency listing` 中找到 `requires` 字样，然后根据后面提示的 Mod 信息查找对应 Mod 并下载安装。

如果一个 Mod 要求特定版本的另一个 Mod ，那么你应当寻找符合要求的 Mod 版本。

相关英文提示： any -> 任何 ； version(s) -> 版本 ； require(s) -> 要求，需要 ； of -> 的（介词）

```
// 在示例中，您应该安装 Zoomify Mod 的前置 Mod：Fabric API。
Unmet dependency listing:
	 - Mod 'Zoomify' (zoomify) 2.11.0 requires any version of fabric-api, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索 Mods 所需的前置 Mods。

> Modrinth 和 CurseForge 目前为止未提供中文界面，有困难的用户建议使用 MC百科 进行查询。

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

相关英文提示： any -> 任何 ； version(s) -> 版本 ； require(s) -> 要求，需要 ； of -> 的（介词）

```
// 在示例中，您应该安装 Sodium Extra Mod 的前置 Mod：Sodium。
Sodium Extra requires version [0.4.10, ∞) of sodium, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索 Mods 所需的前置 Mods。

> Modrinth 和 CurseForge 目前为止未提供中文界面，有困难的用户建议使用 MC百科 进行查询。

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

#### 无法加载世界

解释：使用的 OptiFine 导致了游戏出现问题

解决方案：可以尝试更换 OptiFine 的版本

关键词：

```
java.lang.NoSuchMethodError: net.minecraft.world.server.ChunkManager$ProxyTicketManager.shouldForceTicks(J)Z
```

#### Forge 与 OptiFine 兼容性问题导致的崩溃

解释：使用的 Forge 版本过高 / 过低 或 OptiFine 并未兼容该版本的 Forge，导致游戏崩溃。

解决方法：前往 [OptiFine 官网](https://optifine.net/downloads) ，按照提示安装对应的 Forge 版本。

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

java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.texture.SpriteContents.<init>(net.minecraft.resources.ResourceLocation

java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager.addRegionTicket(net.minecraft.server.level.TicketType, net.minecraft.world.level.ChunkPos, int, java.lang.Object, boolean)'

TRANSFORMER/net.optifine/net.optifine.reflect.Reflector.<clinit>(Reflector.java
```
