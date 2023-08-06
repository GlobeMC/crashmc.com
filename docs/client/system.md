# 系统问题

`Minecraft` 客户端可以在多款系统上运行，自然也避免不了因为适配系统带来的问题。因此，此处提供部分常见问题及解决方案。

## 通用问题

这些问题在各种系统中都会出现，因此放在最前面。

### OpenGL 错误（聊天栏中出现）

| 错误码 | 可能原因                               | 解决方法                                                                             |
| ------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 1280   | OptiFine / Mods 冲突 / OpenGL 版本错误 | 更换 OptiFine 版本、检查 Mods 冲突或尝试更新显卡驱动                                 |
| 1281   | Mods / 图像设置 / 显卡驱动 / 光影      | 尝试更新显卡驱动或检查 Mods 问题(如检查后无问题，则暂时无解)                         |
| 1282   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换游戏版本，更换 OptiFine 版本，检查 Mods 问题，检查材质包和光影包，或更换显卡驱动 |
| 1283   | Mods                                   | 更换光影或检查 Mods 问题                                                             |
| 1284   | 显卡驱动 / Mods 冲突 / 着色器出错      | 更换光影或检查 Mods 问题                                                             |
| 1285   | 配置文件冲突 / 内存不足 / Mods 冲突    | 给游戏分配更多的内存或尝试重新安装游戏                                               |
| 1286   | 内存溢出 / 显卡驱动                    | 给游戏分配更多的内存或尝试更新显卡驱动                                               |

### 显卡 / 显卡驱动问题

解释：因为你的显卡配置或显卡驱动存在问题，游戏无法正常运行。

解决方法：检查显卡驱动是否为最新；如果有独立显卡的请使用独立显卡运行游戏，而非核显。

驱动下载：[Intel](https://www.intel.cn/content/www/cn/zh/search.html#sort=relevancy&f:@tabfilter=[Downloads]&f:@stm_10385_zh=[%E6%98%BE%E5%8D%A1]) | [AMD](https://www.amd.com/zh-hans/support) | [Nvidia](https://www.nvidia.cn/geforce/drivers/)

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

内存清理 <LauncherBadge type="bakaxl" text="BakaXL" /> ：前往 `本体设置` -> `Java 虚拟机与内存` ，确保 `自动设置内存` 设置为开，然后展开 `内存高级设置` ，点击 `强制释放内存` （可多次点击），然后再次启动游戏。

内存优化 <LauncherBadge type="pcl" text="PCL2" /> ：前往 `设置` -> `游戏` -> `游戏内存` ，确保内存配置选项为 `自动配置` 。然后前往 `更多 - 百宝箱` ，点击 `内存优化` ，然后按照提示给予启动器管理员权限，等待内存优化完成后再次启动游戏。

关键词：

```
java.lang.OutOfMemoryError
Could not reserve enough space
```

### 页面文件问题

解释：由于页面文件太小，游戏无法继续运行。

解决方案：检查页面文件大小

在 Windows 系统中，右键 `此电脑` -> `属性` -> `高级系统设置` -> `性能设置` -> `高级` -> `更改虚拟内存` -> 勾选 `自动管理所有驱动器分页文件大小`

关键词（仅供参考）：

```
页面文件太小，无法完成操作。
```

### Java 问题

请在排查错误之前先打开启动器的 **自动决定 Java** 功能，然后再尝试启动游戏复现问题。在通常情况下，你不应该关闭这个功能。

以下为几个常见的因为 Java 的**非版本问题**导致的错误。

#### 使用 OpenJ9

解释：游戏因为使用 OpenJ9 而崩溃了。

解决方案：卸载当前 Java ，然后前往其他地方获取一个非 OpenJ9 的 Java。

:::details 常见的第三方启动器获取 Java 方法
在<LauncherBadge type="bakaxl" text="BakaXL" />启动器设置中获取 Java：前往 `本体设置` -> `Java 虚拟机与内存` ，点击获取对应的 Java 版本。

在<LauncherBadge type="pcl" text="PCL2" />启动器中获取 Java：卸载当前 Java 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在<LauncherBadge type="hmcl" text="HMCL" />启动器中获取 Java：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。
:::

:::details 其他 Java 获取方法
从官网下载并手动安装 Java: [Java 8](https://www.java.com/zh-CN/download/) | [JDK 17+](https://www.oracle.com/java/technologies/downloads/)

获取 (Java 9+) 且已存档的 JDK 包: <https://jdk.java.net/archive/>
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
:::warning 注意
此方法仅适用于 64 位系统。
:::
1. 卸载当前 Java ，然后去其他地方重新获取 64 位的 Java。

:::details 常见的第三方启动器获取 Java 方法
在<LauncherBadge type="bakaxl" text="BakaXL" />启动器设置中获取 Java：前往 `本体设置` -> `Java 虚拟机与内存` ，点击获取对应的 Java 版本。

在<LauncherBadge type="pcl" text="PCL2" />启动器中获取 Java：卸载当前 Java 后重启启动器，直接点击启动游戏，启动器提示自动补全 Java 时，点击 `自动下载` 。

在<LauncherBadge type="hmcl" text="HMCL" />启动器中获取 Java：卸载当前 Java 后重启启动器，按照启动器引导下载 Java。
:::

:::details 其他 Java 获取方法
从官网下载并手动安装 Java: [Java 8](https://www.java.com/zh-CN/download/) | [JDK 17+](https://www.oracle.com/java/technologies/downloads/)

获取 (Java 9+) 且已存档的 JDK 包: <https://jdk.java.net/archive/>
:::

:::warning 注意
不推荐使用此方法，可能会导致游戏卡顿，但 32 位系统只能这么做。
:::
2. 在启动器的内存设置中调整游戏内存分配至小于等于 1G （1G = 1024M）。

:::warning 注意
需要一定技术基础，适用于 32 位系统，但为 64 位处理器。
:::
3.自行重装系统为 64 位。你可以使用微软官方提供的重装工具，抑或是使用 `EasyRC 一键重装` 等无捆绑一键重装工具。

关键词：

```
Could not reserve enough space for 1048576KB object heap
```

## Windows 问题

TO BE COLLECTED

## MacOS 问题

### Mac 下存在 .DS_Store 文件导致报错

```
Caused by: net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:
```

解决方法：删除 `.DS_Store` 文件

:::details 解决步骤
由于 `.DS_Store` 文件是 MacOS 的隐藏文件， 只能通过执行指令进行删除

1. 进入搜索栏，搜索 `终端` 或 `Terminal`， 并打开该软件
2. (可选) 使用 `cd <游戏路径>` 指令进入游戏目录
   - 注 1: 官启的 `<游戏路径>` 为 `"~/Library/Application Support/minecraft/"`
   - 注 2: 其他第三方启动器的 `<游戏路径>` 一般是与启动器文件同级的 `.minecraft` 文件夹
   - **注 3: `.DS_Store` 用于保存文件移动记录 _(可见并不是非常重要)_ 。但若不在游戏目录下执行本操作， 将无法撤回任何文件移动操作， 并且 `find` 指令耗时也会很长**
3. 执行如下指令:
   ```sh
   rm $(find . -name .DS_Store 2>/dev/null)
   ```
   :::

### 不兼容 Mac 的 Mod

```
Exception caught during firing event: Unable to load library 'imm32':
class io.github.reserveword.imblocker.IMBlocker$RegistryEvents
```

解决方法：删除 `IMBlocker` 模组（此模组仅适用于 Windows）

### Mac 下初始化 OpenGL 窗口问题

```
java.lang.IllegalStateException: GLFW error before init: [0x10008]Cocoa: Failed to find service port for display
```

解决方法<Badge type="warning" text="实验性" />：先开一个浏览器全屏，然后启动游戏，在还没弹出窗口的时候迅速切回浏览器，等差不多游戏窗口出来了之后再切回去。

## Linux 问题

TO BE COLLECTED
