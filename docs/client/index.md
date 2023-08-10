# 客户端问题

## 基础知识

Minecraft 客户端，是 Minecraft 游戏本身一大组成部分。通俗来说，玩家游玩的 Minecraft 游戏本身就是客户端。

客户端需要使用 `启动器` 启动。有关启动器，可以参考[基础知识](https://crashmc.com/basis.html)。

:::tip
如果您对 Minecraft 有较详细的理解，那么您不必完整阅读。
:::

## 游戏文件 & 日志

游戏的文件目录一般如下所示。

```
.minecraft
├─assets
│  ├─indexes
│  ├─objects
│  │  ├─00
│  │  ├─01
│  │  ├─02
│  │  ├─03
│  │  ├─04
│  │  ├─05
│  │  ├─06
│  │  ├─07
│  │  ├─08
│  │  ├─09
│  │  ├─0a
│  │  ├─0b
│  │  ├─0c
│  │  ├─0d
│  │  ├─0e
│  │  ├─0f
│  │  ├─10
│  │  ├─11
│  │  ├─12
│  │  ├─...
│  │  ├─fe
│  │  └─ff
│  ├─skins
│  │  ├─00
│  │  ├─01
│  │  ├─02
│  │  ├─03
│  │  ├─04
│  │  ├─05
│  │  ├─06
│  │  ├─07
│  │  ├─08
│  │  ├─09
│  │  ├─0a
│  │  ├─0b
│  │  ├─0c
│  │  ├─0d
│  │  ├─0e
│  │  ├─0f
│  │  ├─10
│  │  ├─11
│  │  ├─12
│  │  ├─...
│  │  ├─fe
│  │  └─ff
│  └─virtual
│      └─legacy
│          ├─...
├─libraries
│  ├─...
└─versions
    ├─[版本名]
    │  ├─[版本名]-natives
    │  ├─crash-reports
    │  ├─logs
    │  ├─mods
    │  ├─resourcepacks
    │  ├─saves
    │  │  └─[存档名]
    │  │      ├─advancements
    │  │      ├─data
    │  │      ├─datapacks
    │  │      ├─DIM-1
    │  │      │  └─data
    │  │      ├─DIM1
    │  │      │  └─data
    │  │      ├─entities
    │  │      ├─playerdata
    │  │      ├─poi
    │  │      ├─region
    │  │      ├─serverconfig
    │  │      └─stats
    │  └─screenshots
```

这其中，我们要寻找的日志如下。部分启动器也支持导出错误报告，此时可以在错误报告中直接寻找。

- 关闭版本隔离：`.minecraft\crash-reports\crash-***.txt`

- 开启版本隔离：`.minecraft\versions\***\crash-reports\crash-***.txt`

## 处理崩溃

得到了崩溃日志，就可以处理崩溃了。在接下来的文档中，有针对于 Mod 问题、系统问题、原版问题的解决方案，您可以对照日志自行参考解决。

最后，希望我们能帮助您成功解决问题，祝您游玩愉快！