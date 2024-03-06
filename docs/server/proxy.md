# 跨服端问题

:::info WIP
本页文档仍在编写，如果你感兴趣的话，可以帮助我们完善它！
:::

## BungeeCord 及其衍生服务端

## Velocity 及其衍生服务端

### 无法链接到后端服务器 

解释：Velocity 无法链接到你设定的服务器上。 

解决方案：检查后端服务器是否开启，或检查配置文件中的链接地址是否正确。  

关键词：
```
io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: no further information: 
Caused by: java.net.ConnectException: Connection refused: no further information
``` 

### 后端服务器正版验证未关闭

解释：后端服务器开启了正版验证  

解决方案：打开服务端所在目录下的 `server.properties`，修改 `online-mode` 的值为 `false`。

关键词：
```
java.lang.IllegalStateException: Backend server is online-mode!
```