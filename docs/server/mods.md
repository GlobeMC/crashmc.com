# Mod 问题

## 在服务端运行仅客户端模组

解决方案：移除日志中指示的 Mod。例如下方的情况应该移除 distanthorizons。

```
[net.minecraftforge.fml.javafmlmod.FMLModContainer/LOADING]: Failed to create mod instance. ModID: distanthorizons, class com.seibel.distanthorizons.forge.ForgeMain
```

关键词：

```
Caused by: java.lang.RuntimeException: Attempted to load class net/minecraft/client/Minecraft for invalid dist DEDICATED_SERVER

java.lang.NoClassDefFoundError: net/minecraft/client/Minecraft
```

## Fabric

### 模组问题

解决方案：移除日志中指示的 Mod。例如下方的情况应该移除 Sodium。

```
net.fabricmc.loader.impl.FormattedException: java.lang.RuntimeException: Could not execute entrypoint stage 'preLaunch' due to errors, provided by 'sodium'!
```

关键词：

```
net.fabricmc.loader.impl.FormattedException: java.lang.RuntimeException: Could not execute entrypoint stage '***' due to errors, provided by '***'!
```

## Forge

### 渲染优化模组问题

:::tip 提示
请确认您是否在服务器里安装了 **OptiFine** (高清修复) 或 **Oculus** 等渲染优化模组。
:::

解决方案：移除 Oculus 或包含 Iris 的 Mod。

关键词：
```
加载类 net.coderbot.iris.Iris 失败

Failed to load class net.coderbot.iris.Iris
```

## NeoForge

待补充
