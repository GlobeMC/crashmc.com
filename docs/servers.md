# 服务器崩溃

## 不基于（或包含）Bukkit

### Vanilla（原版）

### Fabric

### Forge

:::tip 提示
请确认您是否在服务器里安装了 **OptiFine** *(高清修复)* 等渲染优化模组，例如 **Oculus**
:::

当 log 内含有 `加载类 net.coderbot.iris.Iris 失败` 或 `Failed to load class net.coderbot.iris.Iris` 时，请移除 Oculus 或包含 Iris 的 Mod。

### NeoForge

## 基于（或包含）Bukkit

### Spigot

### Paper 及其衍生服务端

#### 无法加载世界存档

```
java.lang.RuntimeException: Server attempted to load chunk saved with newer version of minecraft! 3337 > 3218
// 这是一个使用 Paper 1.19.4 (3337) 加载 1.19.3 (3218) 世界存档的示例。
```

使用了一个高版本的服务端加载低版本的世界存档

解决方法：更换到对应的版本

> 关于应该使用的游戏版本，请查阅 [数据版本 - Minecraft Wiki](https://minecraft.fandom.com/zh/wiki/数据版本#数据版本列表)。

#### 未同意EULA

```
You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
```
解决方法：前往 ./eula.txt 中将 eula=false 更改为 eula=true 

## 代理端

### Bungee 及其衍生服务端如： Waterfall

### Velocity 及其衍生服务端

#### 端口被占用

```
Perhaps a server is already running on that port?
```
解决方法：Velocity 与下游服务端不可占用同一个端口，请修改 Velocity 的代理端口
