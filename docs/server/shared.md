# 通用问题

## 未同意 EULA

解释：没有同意[《最终用户许可协议》(EULA)](https://www.minecraft.net/zh-hans/eula)。

解决方案：将服务端所在目录下的 `eula.txt` 中的 `eula=false` 更改为 `eula=true`，然后重启服务器。

关键词：

```
You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
```

## 端口被占用

解释：欲用作启动服务器的端口被其它进程占用。

解决方案：打开服务端所在目录下的 `server.properties`，修改 `server-port` 的值。注意这个值要介于 `1024` 与 `65536` 之间。

关键词：

```
Perhaps a server is already running on that port?
```

## 1 tick 执行时间过长

解释：服务器 1 tick 执行时间过长导致崩溃

解决方案：修改 `server.properties` 文件，将 `max-tick-time` 值调高或设为 `-1`

关键词：

```
java.lang.Error: Watchdog
```

## 服务端没有权限写入所在文件夹

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
