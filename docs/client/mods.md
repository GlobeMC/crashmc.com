# 模组问题

`Minecraft` 拥有庞大的玩家社区，也有许多的社区开发者制作 `Mod` 为原版游戏增加扩展内容及玩法，但同时这也导致了许许多多的问题，这里列出部分常见的 `Mod` 问题及解决方案。

## Java 问题

### Java 版本不匹配

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

| 关键词                                                 | 解决方法                                |
| ------------------------------------------------------ | --------------------------------------- |
| `no such method: sun.misc.Unsafe.defineAnonymousClass` | Java 版本过高，降低 Java 版本至 17 以下 |

附 Java 版本查询列表

:::details Java 版本查询列表
| Java 大版本 | Class File Version |
|------------|--------------------|
| Java 20 | 64 |
| Java 19 | 63 |
| Java 18 | 62 |
| Java 17 | 61 |
| Java 16 | 60 |
| Java 15 | 59 |
| Java 14 | 58 |
| Java 13 | 57 |
| Java 12 | 56 |
| Java 11 | 55 |
| Java 10 | 54 |
| Java 9 | 53 |
| Java 8 | 52 |
| Java 7 | 51 |
:::

### 其他 Java 问题

解释：由于低版本 Forge 和高版本 Java 不兼容，导致了游戏崩溃。

解决方案：卸载当前 Java 8 ，然后前往其他地方获取版本号小于等于 8u312 且大于等于 8u51 的 Java 8。

:::details 常见的第三方启动器获取 Java 方法
在<LauncherBadge type="bakaxl" text="BakaXL" />启动器设置中获取 Java：前往 `本体设置` -> `Java 虚拟机与内存` ，点击获取对应的 Java 版本。

在<LauncherBadge type="pcl" text="PCL2" />启动器中获取 Java：卸载当前 Java 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在<LauncherBadge type="hmcl" text="HMCL" />启动器中获取 Java：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。
:::

:::details 其他 Java 获取方法
从官网下载并手动安装 Java: [Java 8](https://www.java.com/zh-CN/download/) | [JDK 17+](https://www.oracle.com/java/technologies/downloads/)

获取 (Java 9+) 且已存档的 JDK 包: <https://jdk.java.net/archive/>
:::

## Mod 重复安装

解释：由于有 Mod 重复安装，导致游戏无法正常运行。

解决方案：排查重复的 Mod，然后移除重复项直至只剩下一个该 Mod 文件。

关键词：

```
DuplicateModsFoundException
Found a duplicate mod
ModResolutionException: Duplicate
```

## Mod 过多导致超出 ID 限制

解释：你所安装的 Mod 过多，超出了游戏的 ID 限制，导致游戏崩溃。

解决方案：请尝试安装 JEID 等修复 Mod，或删除部分大型 Mod。

关键词：

```
maximum id range exceeded
```

## 解压了 Mod

解释：因为 Mod 文件被解压了，游戏无法继续运行。

解决方案：删除 Mods 文件夹中已被解压的 Mod ，然后重新获取被删除的 Mod。

关键词：

```
The directories below appear to be extracted jar files. Fix this before you continue.
Extracted mod jars found, loading will NOT continue
```

## Mod 名称含有特殊字符

解释：由于 Mod 名称中含有特殊字符，游戏无法正常启动。

解决方案：删去 Mod 文件名中的特殊字符，然后再次启动游戏。

关键词：

```
Invalid module name: '' is not a Java identifier
```

## 一些 Mod 需要访问国外网络

解释：一些整合包里会内置一个自动下载 Mod 的 Mod，但部分 Mod 需要访问国外网络才能顺利下载。下面列出目前已知的访问国外网络：

```
- modpack-update-checker

- commonality

```

解决方案：

1.尝试禁用这些 Mod；

2.挂个梯子。

## Forge

### Json 问题

解释：可能由于使用一些启动器修改了 Forge 版本，当前实例的 Json 文件存在异常。

解决方案：

重新安装：请尝试重新全新安装 Forge，而非使用其他启动器修改 Forge 版本。

重置核心<LauncherBadge type="bakaxl" text="仅 BakaXL" /> ：前往 `核心列表` -> `核心高级设置` -> `恢复 / 删除` -> `重置此核心` 尝试重置核心。

关键词：

```
Found multiple arguments for option fml.forgeVersion, but you asked for only one
```

### Night Config 库的问题

解释：Night Config 库的一些常见问题导致的，会导致无法读取配置文件。有关详细信息，可访问[此处](https://github.com/Fuzss/nightconfigfixes#readme)查看。

解决方案：请尝试下载并安装该 Mod：`Night Config Fixes`。[MC百科](https://www.mcmod.cn/class/9007.html) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/night-config-fixes)

关键词：

```
Caused by: com.electronwill.nightconfig.core.io.ParsingException: Not enough data available
```

## NeoForge

## Fabric

### 版本不兼容

解释：有 Mod 与当前游戏版本不兼容

```
// 在示例中，你应该安装 Fabric API 1.20.1 版
- Mod 'Fabric API' (fabric-api) 0.82.1+1.20 requires any version between 1.20- (inclusive) and 1.20.1- (exclusive) of 'Minecraft' (minecraft), but only the wrong version is present: 1.20.1!

```

### 缺少前置

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

### Mod 冲突

解释：由于两个或多个 Mods 互相冲突，导致游戏无法正常运行。

解决方案：移除相互冲突的其中一个 Mod。

```
// 在示例中，您应该移除 OptiFabric，或移除 Sodium 和 Iris
net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!
A potential solution has been determined:
	 - Replace mod 'Sodium' (sodium) 0.4.10+build.27 with any version that is compatible with:
		 - optifabric 1.13.25
	 - Replace mod 'Iris' (iris) 1.6.4 with any version that is compatible with:
		 - optifabric 1.13.25
```

关键词：

```
net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!

that is compatible with
```

## Quilt

### 缺少前置

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

## LiteLoader

## OptiFine

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
