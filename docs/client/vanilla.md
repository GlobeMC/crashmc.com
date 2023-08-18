# 原版问题

`Minecraft` 原版游戏中本身也存在许多问题，这里列出部分常见问题及解决方案。

> 该板块内容也适用于安装了 Mod 加载器或 Mod 的游戏实例。

> 以下的原版游戏皆指 **未安装 OptiFine 或者 Mod 加载器等修改原版核心工具** 的 Minecraft 游戏实例。

在处理原版崩溃之前，需要注意的是 Mojang 几乎完全没有可能写一个 100% 会爆炸的东西出来然后推送到正式版。因此 99.99% 的原版崩溃问题都来自外界。

首先请确保已经打开了启动器的 **自动决定 Java** 功能，否则可能会因为使用的 Java 版本错误而导致启动失败。

如果你是在安装一个新的 MC 版本之后发生了崩溃，那么请确保你的网络连接良好，然后前往启动器内使用 **补全文件** 功能。

:::details 常见的第三方启动器补全功能位置

重置核心 <LauncherBadge type="bakaxl" text="BakaXL" />：`核心列表` -> `点击核心` -> `高级核心管理` -> `恢复 / 删除` -> `重置此核心`

更新游戏资源文件 <LauncherBadge type="hmcl" text="HMCL" />：点击左边的 `实例名称` -> `管理` -> `更新游戏资源文件`

补全文件 <LauncherBadge type="pcl" text="PCL2" />：`版本设置` -> `补全文件`
:::

如果你在启动游戏时弹出了 **含有 OpenGL 字样** 的英文弹窗，请前往你使用的显卡官网下载对应你显卡的最新驱动并安装。如果你使用的是 3 代及以前的 Intel 核显，则理论上无法游玩任何需要 Java 17 的版本。你也可以尝试使用软渲染器<LauncherBadge type="hmcl" text="仅 HMCL" />（在 `游戏特定设置` -> `高级设置` -> `渲染器` 里修改），但这可能会严重降低游戏性能。

如果你正在游玩 1.16.5 或以下版本，请 [下载 Java 8u51](https://cdn.crashmc.com/https://github.com/frekele/oracle-java/releases/download/8u51-b16/jre-8u51-windows-x64.exe) 并安装，然后使用该 Java 启动游戏。

## 存档损坏

关键词

```
Exception reading *\level.dat
Caused by: java.util.zip.ZipException: invalid distance too far back
net.minecraft.util.crash.CrashException: Loading NBT data
```

解决方案：

尝试打开存档目录，然后删除 `level.dat`，并将 `level.dat_old` 重命名为 `level.dat`。

对于专业玩家，您也可以使用 NBT 编辑器。

## 资源包过大

解释：由于资源包过大，或是你的显卡配置不足，导致游戏不能正常运行。

解决方案：使用更低分辨率的资源包，或者换个更好的显卡？

关键词：

```
Maybe try a lower resolution resourcepack?
```

## 文件校验失败

解释：由于部分游戏文件或资源校验失败，游戏无法正常启动。

解决方案：使用启动器补全文件，抑或是重新下载游戏。

:::details 常见的第三方启动器补全功能位置

重置核心 <LauncherBadge type="bakaxl" text="BakaXL" />：`核心列表` -> `点击核心` -> `高级核心管理` -> `恢复 / 删除` -> `重置此核心`

更新游戏资源文件 <LauncherBadge type="hmcl" text="HMCL" />：点击左边的 `实例名称` -> `管理` -> `更新游戏资源文件`

补全文件 <LauncherBadge type="pcl" text="PCL2" />：`版本设置` -> `补全文件`
:::

关键词：

```
signer information does not match signer information of other classes in the same package
```

## 显存 / 内存问题

解释：显存溢出，或者内存分配过多导致问题。

解决方案：请逐个尝试以下方案。

1. 在桌面右键 `此电脑`，依次点击 `属性` -- `高级系统设置`，按下图顺序改成 `自动管理所有驱动器分页文件大小`，改完后点三个 `确定`（**不要**点右上角的叉），然后重启计算机。

![显存溢出解决方案](https://img.kookapp.cn/assets/2023-03/bGbLMNRnws1020j1.png)

2. 将内存分配量手动调低，再次尝试启动游戏。
3. 关闭光影。

关键词：

```
message='GL_OUT_OF_MEMORY error generated. Failed to allocate memory for buffer data.'
```

## 防火墙 / 防病毒安全软件 / 网络环境问题

关键词：

```
java.lang.IllegalStateException: failed to create a child event loop
```

解决方案：请逐个尝试以下方案。

1. 如您安装了 Avast，尝试重新安装并重启 Avast。
2. 如您安装了 McAfee（及其衍生产品）或 Outpost Security，尝试卸载该软件并再次重新启动游戏。
3. 如您没有防病毒安全软件，尝试在 Microsoft Defender 中的 “防火墙和网络保护” 中关闭 “专用网络保护”。
4. 关闭您的加速器或 VPN。
5. 前往 Oracle 官网下载最新版 Java，并将该 Java 设置为游戏 Java。

:::details 常见的第三方启动器设置版本 Java 功能位置

Java 虚拟机 <LauncherBadge type="bakaxl" text="BakaXL" />：`核心列表` -> `点击核心` -> `高级核心管理` -> `Java 虚拟机与内存` -> `为此核心启用单独的 Java 虚拟机设定` 设置为 `开`

Java 路径 <LauncherBadge type="hmcl" text="HMCL" />：点击左边的 `实例名称` -> `Java 路径`

游戏 Java <LauncherBadge type="pcl" text="PCL2" />：`版本设置` -> `设置` -> `游戏 Java`
:::

6. 更新显卡驱动程序。
7. 如您正在使用 NVIDIA，请在 NVIDIA 控制面板的 “管理 3D 设置” 中对 Minecraft 恢复默认设置。
8. 对于 Windows 操作系统，使用 Win+S 打开搜索框，搜索 “cmd”，点击搜索结果中右侧 “以管理员身份运行” 选项以使用管理员身份打开 cmd.exe，**依次**输入以下命令后重启计算机：

::: warning 警告
以下命令将重置您的 WINSOCK、IPv4、IPv6 网络。
:::

```bat
netsh winsock reset 
netsh winsock reset catalog 
netsh int ipv4 reset reset.log 
netsh int ipv6 reset reset.log
```

如以上方案仍无法解决崩溃问题，请尝试以下的**临时解决方案**：

::: warning 警告
请注意，以下解决方案均是临时的，无法彻底解决崩溃问题，多次使用后可能导致存档加载困难甚至进一步导致存档损坏，请结合自身情况适当进行采用。
:::

方法一：

1. 关闭所有游戏实例。
2. 打开版本所在的 Minecraft 游戏文件夹，删除以下名称的文件夹（如未找到则无需操作）：assets、bin、libraries、versions、webcache、config、defaultconfigs、usercache.json、usernamecache.json。

:::details 常见的第三方启动器打开当前游戏文件夹位置

<LauncherBadge type="bakaxl" text="BakaXL" />：切换至下方页面 -> `本体设置` -> `游戏目录` -> `可读写的 Minecraft 实例目录` -> 当前版本所在的游戏文件夹右侧的定位按钮

<LauncherBadge type="pcl" text="PCL2" />：`版本选择` -> 鼠标悬浮于当前处在的游戏文件夹上方 -> 左边栏右侧出现的齿轮按钮 -> `打开`
:::

3. 重新下载并安装 Minecraft。
4. 关闭所有 Minecraft 启动器。
5. 重新启动游戏。

通常，在进行上述操作后，游戏会成功启动一至两次，而后问题会再次出现。

方法二：

::: warning 警告
请注意，重复此办法打开存档数次后，存档将愈加难以成功进入。
:::

进入游戏后，重复尝试进入存档，通常会有很大概率在第二次成功打开存档。