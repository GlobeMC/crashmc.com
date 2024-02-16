# 插件问题

:::info WIP
本页文档仍在编写，如果你感兴趣的话，可以帮助我们完善它！
:::

## Bukkit 系服务端

### 通用问题

#### 服务端没有权限写入所在文件夹

解释：Minecraft 服务端无权限写入文件夹

解决方法：

对于 Linux / macOS 系统：尝试通过在启动指令前加上 sudo 或在 root 账户下运行，修改 Minecraft 服务端所在文件夹的操作权限，或改用通过 Docker 容器运行 Minecraft 服务端

对于 Windows 系统：尝试以管理员身份启动 Minecraft 服务端，或修改 Minecraft 服务端所在文件夹的操作权限

对于通过从服务商购买 Minecraft 服务器面板的用户，请联系您的服务商以寻求帮助


关键词

```log
ServerMain ERROR Cannot access RandomAccessFile java.io. FileNotFoundException: logs/latest.log (Permission denied) java.io.FileNotFoundException: logs/latest.log (Permission denied)
        at java.base/java.io.RandomAccessFile.open0(Native Method)
        at java.base/java.io.RandomAccessFile.open(RandomAccessFile.java:344)
        at java.base/java.io.RandomAccessFile.<init>(RandomAccessFile.java:259)
        at java.base/java.io.RandomAccessFile.<init>(RandomAccessFile.java:213)
        at java.base/java.io.RandomAccessFile.<init>(RandomAccessFile.java:127)
// 该处虽然只是表示了无权限写入 latest.log ，但一般情况下这意味着服务端没有所在文件夹的写入权限，除非您单独为 latest.log 设置了操作权限
```

### Spigot 及其衍生服务器端


### Paper 及其衍生服务器端

#### 无法加载世界存档

解释：使用高版本服务端加载低版本存档。

解决方案：更换到存档对应的版本再试。

关键词：

```log
java.lang.RuntimeException: Server attempted to load chunk saved with newer version of minecraft! 3337 > 3218
// 这是一个使用 Paper 1.19.4 (3337) 加载 1.19.3 (3218) 世界存档的示例。
```

> 关于应该使用的游戏版本，请查阅[数据版本 - Minecraft Wiki](https://minecraft.fandom.com/zh/wiki/数据版本#数据版本列表)。

## 代理端

### BungeeCord 及其衍生服务端

### Velocity 及其衍生服务端
