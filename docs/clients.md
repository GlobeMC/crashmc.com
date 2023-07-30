# 客户端崩溃

## 在此之前...

如果你正在使用 **官方启动器**（Minecraft Launcher） ，我们更建议你使用 **第三方启动器** 复现问题再进行排查。一般而言，第三方启动器会更有利于 Mod 相关调试。本文档也是针对第三方启动器做最好优化的。

请确保你能复现崩溃，之后找到 `.minecraft\versions\<核心名称>\logs\latest.log` （未开启版本隔离则为 `.minecraft\logs\latest.log` ）开始分析里面的内容。

如果你的游戏是因为未响应崩溃的，我们暂时没有办法解决。:（

## 原版游戏（未安装模组加载器）

在处理原版崩溃之前，需要注意的是 Mojang 完全没有可能写一个 100% 会爆炸的东西出来然后推送到正式版。因此 99% 的原版崩溃问题都来自外界。

首先请确保已经打开了启动器的 **自动决定 Java **功能，否则可能会因为使用的 Java 版本错误而导致启动失败。

如果你是在安装一个新的 MC 版本之后发生了崩溃，那么请确保你的网络连接良好，然后前往启动器内使用 **补全文件** 功能。（BakaXL：核心列表 - 点击核心 - 高级核心管理 - 恢复 / 删除 - 重置此核心；HMCL：版本列表 - 核心右边的`...` - 游戏管理 - 管理 - 更新游戏资源文件；PCL2：版本设置 - 补全文件）

如果你是在启动 1.17 及以上版本时出现了错误，并且呈现形式为 **含有 OpenGL 字样** 的英文弹窗时，请前往你使用的显卡官网下载对应你显卡的最新驱动并安装。如果你使用的是 3 代及以前的 Intel 核显，则无法游玩任何需要 Java 17 的版本。

## 已安装模组加载器

### Forge

Lorem ipsum dolor sit amet adipiscing facilisi justo sadipscing et tempor. Ut zzril feugiat erat eum vero in labore et takimata vero praesent. Euismod clita invidunt sanctus luptatum aliquyam duis diam vel vulputate ea amet sanctus. Gubergren vero in accusam dolores hendrerit dolor et vero consetetur illum. Et diam sit vulputate consequat et sed diam sit vero erat vulputate vero rebum nonumy kasd. Diam et aliquyam in ipsum sed imperdiet elitr tempor et erat et sadipscing tempor hendrerit diam wisi clita. Delenit lorem eirmod dolore eos aliquyam consetetur. Dignissim dolores minim et sit tempor aliquyam illum. Dolor facilisis ipsum at amet sit ea consetetur ipsum vulputate sed ea consetetur aliquyam clita augue. Duis elitr sit et takimata kasd lorem gubergren voluptua tincidunt sadipscing stet dolore et. Et option nonumy sit delenit. Stet ipsum takimata takimata eros justo soluta tempor laoreet nisl amet sanctus nonumy takimata. Sit consetetur consectetuer dolore amet et vero possim in eos et vero. Dolor rebum sed. Ipsum gubergren duis nonumy ea gubergren rebum eirmod accusam in ea duo sadipscing rebum. Sea consetetur at tempor et molestie erat invidunt. Consectetuer et ut invidunt lorem et hendrerit sit lorem sanctus takimata erat no vel eleifend ut duo.

### Fabric / Quilt

Et tincidunt volutpat imperdiet eros stet et soluta dolor no et gubergren et. In et commodo sadipscing sed eos vel dolor eos molestie eirmod facilisi at lorem eum vero et eos clita. Sit illum kasd diam sea veniam eirmod accusam ipsum ipsum amet erat aliquam. Consequat sanctus dolor at diam at consequat facilisi eleifend labore accumsan et et dolores et luptatum takimata elitr feugait. Kasd gubergren rebum kasd vel vel. Vero ipsum est vulputate vero labore iusto labore no et id. Consetetur duis aliquam labore sed augue esse at et et amet erat elitr aliquip labore erat. Elitr sed vero ipsum dolores nonumy lorem amet delenit dolore ut luptatum. Magna gubergren clita diam veniam sanctus. Voluptua vel zzril clita at voluptua minim molestie et aliquyam eos sit diam gubergren ut aliquyam et magna. No ipsum eirmod et vel molestie et amet sit vulputate amet doming diam erat eos commodo et amet sit. Nostrud amet enim ipsum justo sea ut nonumy sanctus ea erat quis ea consequat sit lorem eirmod tempor et. Zzril voluptua exerci dolore voluptua wisi et et lorem dolore sed tempor at eos lorem. Qui invidunt stet et nisl dolore vel invidunt vero velit iriure et. Ipsum gubergren eirmod erat ipsum kasd consequat. Ipsum diam adipiscing at rebum duo consetetur. Sadipscing velit elitr amet nonummy ipsum ipsum ut.

### Liteloader

