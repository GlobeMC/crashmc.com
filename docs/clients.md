# 客户端崩溃

## 在此之前...

如果你正在使用 **官方启动器**（Minecraft Launcher），我们更建议你使用 **第三方启动器** 复现问题再进行排查。一般而言，第三方启动器会更有利于 Mod 相关调试。本文档也是针对第三方启动器做最好优化的。

请确保你能复现崩溃，之后找到 `.minecraft\versions\<核心名称>\logs\latest.log`（未开启版本隔离则为 `.minecraft\logs\latest.log`）开始分析里面的内容。

如果你的游戏是因为未响应崩溃的，我们暂时没有办法解决 :(

## 常见问题

### OpenGL 错误

该问题在任何情况均可能会出现，此处只考虑错误码出现在聊天栏的情况。

| 错误码 | 可能原因                          | 解决方法                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------ |
| 1280   | OptiFine/模组冲突/OpenGL 版本错误 | 更换 OptiFine 版本、检查模组冲突或尝试更新显卡驱动           |
| 1281   | 模组/图像设置/显卡驱动/光影       | 尝试更新显卡驱动或检查模组问题(如检查后无问题,则暂时无解)    |
| 1282   | 显卡驱动/模组冲突/着色器出错      | 更换游戏版本、更换 OptiFine 版本、检查模组问题或更换显卡驱动 |
| 1283   | 模组                              | 更换光影或检查模组问题                                       |
| 1284   | 显卡驱动/模组冲突/着色器出错      | 更换光影或检查模组问题                                       |
| 1285   | 配置文件冲突/内存不足/模组冲突    | 给游戏分配更多的内存或尝试重新安装游戏                       |
| 1286   | 内存溢出/显卡驱动                 | 给游戏分配更多的内存或尝试更新显卡驱动                       |

## 原版游戏

> 原版游戏指的是**未安装 OptiFine、模组加载器等**修改了游戏的原版 Minecraft。

在处理原版崩溃之前，需要注意的是 Mojang 完全没有可能写一个 100% 会爆炸的东西出来然后推送到正式版。因此 99% 的原版崩溃问题都来自外界。

首先请确保已经打开了启动器的 **自动决定 Java** 功能，否则可能会因为使用的 Java 版本错误而导致启动失败。

如果你是在安装一个新的 MC 版本之后发生了崩溃，那么请确保你的网络连接良好，然后前往启动器内使用 **补全文件** 功能。（BakaXL：核心列表 - 点击核心 - 高级核心管理 - 恢复 / 删除 - 重置此核心；HMCL：版本列表 - 核心右边的`...` - 游戏管理 - 管理 - 更新游戏资源文件；PCL2：版本设置 - 补全文件）

如果你是在启动 1.17 及以上版本时出现了错误，并且呈现形式为 **含有 OpenGL 字样** 的英文弹窗时，请前往你使用的显卡官网下载对应你显卡的最新驱动并安装。如果你使用的是 3 代及以前的 Intel 核显，则无法游玩任何需要 Java 17 的版本。

## 已安装模组加载器

### Forge

### NeoForge

### Fabric

#### 缺少前置

有模组依赖其他模组运行，但未安装依赖的模组

解决方法：

1. 安装依赖模组

```java
// 在示例中，您应该安装 Zoomify 模组的前置模组：Fabric API。
Unmet dependency listing:
	 - Mod 'Zoomify' (zoomify) 2.11.0 requires any version of fabric-api, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索模组所需的前置模组。

> Modrinth 和 CurseForge 没有提供中文，有困难的用户建议使用 MC百科 进行查询。

2. 删除需要前置的模组

```java
// 在示例中，您应该删除 Zoomify 模组。
Unmet dependency listing:
	 - Mod 'Zoomify' (zoomify) 2.11.0 requires any version of fabric-api, which is missing!
```

关键词（仅供参考）：

```java
net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!

which is missing!
```

### Quilt

#### 缺少前置

有模组依赖其他模组运行，但未安装依赖的模组

解决方法：

1. 安装依赖模组

```java
// 在示例中，您应该安装 Sodium Extra 模组的前置模组：Sodium。
Sodium Extra requires version [0.4.10, ∞) of sodium, which is missing!
```

您也可以通过 [MC百科](https://www.mcmod.cn/)、[Modrinth](https://modrinth.com/mods)、[CurseForge](https://www.curseforge.com/minecraft/mc-mods) 等网站搜索模组所需的前置模组。

> Modrinth 和 CurseForge 没有提供中文，有困难的用户建议使用 MC百科 进行查询。

2. 删除需要前置的模组

```java
// 在示例中，您应该删除 Sodium Extra 模组。
Sodium Extra requires version [0.4.10, ∞) of sodium, which is missing!
```

关键词（仅供参考）：

```java
which is missing!
```

### LiteLoader

### OptiFine

#### Forge 与 OptiFine 兼容性问题导致的崩溃

这个是因为使用的 Forge 版本过高/过低 或 OptiFine 并未兼容该版本的 Forge ，导致游戏崩溃

你可以复制下面的关键词在日志中查找是否有匹配的关键词以确定是否是该原因造成的

解决方法：前往 [OptiFine 官网](https://optifine.net/downloads) ，按照提示下载对应的 Forge 版本。

提示：

- 点击 `Show all versions` 即可展开所有的游戏版本，点击 `+ More` 和 `+ Preview versions` 可展开更多

- 若显示 `Forge N/A` 则代表该版本的 OptiFine 不兼容任何 Forge 版本

关键词（仅供参考）：

```
java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'

java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'

java.lang.NoSuchMethodError: 'net.minecraft.network.chat.FormattedText net.minecraft.client.gui.Font.ellipsize(net.minecraft.network.chat.FormattedText, int)'

java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager

java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.block.model.BakedQuad.<init>(int[], int, net.minecraft.core.Direction, net.minecraft.client.renderer.texture.TextureAtlasSprite, boolean, boolean)'

TRANSFORMER/net.optifine/net.optifine.reflect.Reflector.<clinit>(Reflector.java
```