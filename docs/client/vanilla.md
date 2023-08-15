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

解决方法：

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
