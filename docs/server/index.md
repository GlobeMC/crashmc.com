---
contributors: [bingxin666]
---

# 服务端介绍

正在阅读本文档的玩家您好，您可能在搭建服务器时遇到了问题。

这个部分将会帮助您解决服务端**后台**的崩溃。有关客户端问题，请阅读[客户端介绍](https://crashmc.com/client/)。

:::warning 注意
这个部分是服务端**后台**的崩溃解决方案，而不是无法连接到服务器 / 游玩服务器时掉线的解决方案。

如果您在连接到服务器时出错，请自行根据报错文案上网搜索或求助他人。
:::

## 基础知识

Minecraft 服务端，是 Minecraft 游戏本身一大组成部分。通俗来说，玩家游玩的 Minecraft 游戏本身就会连接到一个本地或远程服务器。

服务端需要完整的 Java 环境。

请注意，目前文档仅处理 Java 版服务端的问题，关于 Bedrock 版服务端的问题，您可以前往[基岩版服务器下载](https://www.minecraft.net/zh-hans/download/server/bedrock)了解更多。

同时，该处服务端解决方案也不会涉及到 Geyser 此类实现基岩版与 Java 版玩家共存于一个服务器的问题，如果您需要帮助，请联系插件作者而不是我们。

:::tip
如果您对 Minecraft 服务端有较详细的理解，那么您不必完整阅读。
:::

## 服务端分类

与客户端不同的是，服务端有着大量的分支，因此我们只能在此处列举一部分

### 原版服务端

即由 Mojang 提供的最原始的服务端文件，可前往[官方网站](https://www.minecraft.net/zh-hans/download/server)下载。

### 插件服务端

| 服务端名称 | 官网链接                                                   | 开发者                             | 
| ---------- | --------------------------------------------------------- | ---------------------------------- | 
| Bukkit     | [Bukkit Forums](https://bukkit.org/)                      | SpigotMC，此前为The Bukkit Project |
| Spigot     | [Spigot 官方网站](https://www.spigotmc.org/)               | SpigotMC                          |
| Sponge     | [Sponge 官方网站](https://spongepowered.org/)             | Sponge                            |
| Paper      | [PaperMC 官方网站](https://papermc.io/)                     | PaperMC                           |
| Cuberite   | [Cuberite 官方网站](https://cuberite.org/)                  | FakeTruth，其原始名称为 “MCServer”   |
| ……         | ……                                                         | ……                               |

注1：这里没有列出 Paper 和 Spigot 的分支服务端。

注2：Cuberite 是基于 C++ 重写的 Minecraft 服务端，该文档不会讨论任何不基于原版 Minecraft 客户端修改而成的服务端，如果你在此类服务端中遇到问题，请向服务端作者反馈。

### 模组服务端

| 服务端名称 | 官网链接                                                   | 开发者                             |
| ---------- | --------------------------------------------------------- | ---------------------------------- |
| Forge      | [Forge Forums](https://forums.minecraftforge.net/)        | MinecraftForge                     |
| Fabric     | [Fabric 官方网站](https://fabricmc.net/)                   | FabricMC                         |
| NeoForge   | [NeoForge官网](https://neoforged.net/)                     | NeoForged Foundation             |
| …… | …… | …… |

### 混合服务端

即同时兼容插件和模组的服务端。

| 服务端名称 | 官网链接                                                   | 开发者                             | 兼容的模组端 | 兼容的插件端 |
| ------------| --------------------------------------------------------- | ---------------------------------- | ------------ | --------------- | 
| SpongeForge | [Sponge 官方网站](https://spongepowered.org/)              | Sponge                            | Forge         | Sponge           |
| Mohist     | [Mohist 官方网站](https://mohistmc.com/)                   | MohistMC                            | Forge        | Paper           |
| Arclight   | [Arclight Github](https://github.com/IzzelAliz/Arclight)   | IzzelAliz                          | Forge         | Bukkit          |    
| CatServer  | [CatServer Github](https://github.com/Luohuayu/CatServer)    | Luohuayu                       | Forge         | Spigot            | 
| ……         | ……                                                         | ……                               | ……            | ……                   |

## 日志文件的位置

客户端的崩溃通常会由启动器自动打包崩溃报告，但是服务端没有启动器，需要您自行寻找日志文件。

一般而言，最新的日志文件在 `logs\latest.log`，而崩溃报告在 `crash-reports` 目录下。

得到日志文件后，就可以根据后续的文档处理崩溃了。您也可以使用[崩溃分析工具](https://crashmc.com/analyzer.html)，将日志文件打包成 zip 并上传尝试分析。祝您成功解决问题！
