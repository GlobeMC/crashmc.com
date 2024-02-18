# 插件问题

:::info WIP
本页文档仍在编写，如果你感兴趣的话，可以帮助我们完善它！
:::

## Bukkit 

注：Spigot 和 Paper 及其衍生服务器端的问题也可部分参考该条目

## Spigot 及其衍生服务器端

## Paper 及其衍生服务器端

### 无法加载世界存档

解释：使用高版本服务端加载低版本存档。

解决方案：更换到存档对应的版本再试。

关键词：

```log
java.lang.RuntimeException: Server attempted to load chunk saved with newer version of minecraft! 3337 > 3218
// 这是一个使用 Paper 1.19.4 (3337) 加载 1.19.3 (3218) 世界存档的示例。
```

> 关于应该使用的游戏版本，请查阅[数据版本 - Minecraft Wiki](https://minecraft.fandom.com/zh/wiki/数据版本#数据版本列表)。

