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

解决方案：调整 server.properties 文件，将 max-tick-time 值调高或设为 -1

关键词：

```
java.lang.Error: Watchdog
```
