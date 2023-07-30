# Mixin相关的崩溃

**注意：以下内容可能是高度技术性的 并不一定适合新手查看**  

## Mixin是什么？

> [SpongePowered Mixin](https://github.com/SpongePowered/Mixin) (下称 Mixin ) 是一套用于在程序运行时通过代码注入实现对程序行为进行修改的一套支持库  
> Mixin is a trait/mixin and bytecode weaving framework for Java using ASM  
> SpongePowered Mixin 在各个 Mod 加载器中都有广泛应用


## 如何判断我的 Minecraft 中是否有 Mixin 的参与？

在日志中查找`SpongePowered MIXIN Subsystem`这段文字, 如果找到说明您的 Mod 加载器中使用了 Mixin  

## 在此之前...

## 常见崩溃实例
### Rubidium与OptiFine冲突
若看见了 `OptiFine ZIP file:` ，说明您安装了OptiFine，这一行后面是您的OptiFine路径
```
//在示例中，您的OptiFine的路径为C:\.minecraft\libraries\optifine\OptiFine\1.19.2_HD_U_I2\OptiFine-1.19.2_HD_U_I2.jar
OptiFine ZIP file: C:\.minecraft\libraries\optifine\OptiFine\1.19.2_HD_U_I2\OptiFine-1.19.2_HD_U_I2.jar

//在示例中，Rubidium发生了Mixin注入失败，您不能同时安装Rubidium和OptiFine
Caused by: org.spongepowered.asm.mixin.injection.throwables.InjectionError: Critical injection failure: Redirector redirectFancyGraphicsVignette()Z in rubidium.mixins.json:features.options.MixinInGameHud failed injection check, (0/1) succeeded. Scanned 1 target(s). Using refmap rubidium-refmap.json
```



### Mod 版本 / Mod 所适用的 Minecraft 版本错误




