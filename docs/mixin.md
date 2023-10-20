# Mixin 相关的崩溃

:::warning 警告
**以下内容可能是高度技术性的 并不一定适合新手查看**
:::

:::info WIP
本页文档仍在编写，如果你感兴趣的话，可以帮助我们完善它
:::

## Mixin 是什么？

> [SpongePowered Mixin](https://github.com/SpongePowered/Mixin) (下称 Mixin) 是一套用于在程序运行时通过代码注入实现对程序行为进行修改的一套支持库  
> Mixin is a trait/mixin and bytecode weaving framework for Java using ASM  
> SpongePowered Mixin 在各个 Mod 加载器中都有广泛应用

## 如何判断我的 Minecraft 中是否有 Mixin 的参与？

在日志中查找 `SpongePowered MIXIN Subsystem` 这段文字，如果找到说明您的 Mod 加载器中使用了 Mixin

## 在此之前...

## 常见崩溃实例

### Mixin 注入失败

解释：由于一个或多个 Mod 的 Mixin 注入失败，导致游戏出错。

解决方案：查看日志了解是哪一个或多个 Mod 出错，然后移除它们。

关键词：

```
Mixin apply for mod
failed
```

### Rubidium 与 OptiFine 冲突

若看见了 `OptiFine ZIP file:` ，说明您安装了 OptiFine ，这一行后面是您的 OptiFine 路径

```
// 在示例中，您的 OptiFine 的路径为 C:\.minecraft\libraries\optifine\OptiFine\1.19.2_HD_U_I2\OptiFine-1.19.2_HD_U_I2.jar
OptiFine ZIP file: C:\.minecraft\libraries\optifine\OptiFine\1.19.2_HD_U_I2\OptiFine-1.19.2_HD_U_I2.jar

// 在示例中， Rubidium 发生了 Mixin 注入失败，您不能同时安装 Rubidium 和 OptiFine
Caused by: org.spongepowered.asm.mixin.injection.throwables.InjectionError: Critical injection failure: Redirector redirectFancyGraphicsVignette()Z in rubidium.mixins.json:features.options.MixinInGameHud failed injection check, (0/1) succeeded. Scanned 1 target(s). Using refmap rubidium-refmap.json
```

### OMMC 和 DCCH 模组冲突

日志

```
Mixin apply for mod ommc-1_20_1 failed ommc.mixins.json:feature.dontClearChatHistory.MixinChatHud from mod ommc-1_20_1 -> net.minecraft.class_338: org.spongepowered.asm.mixin.injection.throwables.InvalidInjectionException @At("INVOKE") on net/minecraft/class_338::dontClearChatHistory with priority 1000 cannot inject into net/minecraft/class_338::method_1808(Z)V merged by coffee.waffle.dcch.mixin.DCCHMixin with priority 1000 [PREINJECT Applicator Phase -> ommc.mixins.json:feature.dontClearChatHistory.MixinChatHud from mod ommc-1_20_1 -> Prepare Injections ->  -> handler$fdd000$ommc-1_20_1$dontClearChatHistory(ZLorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V -> Prepare]
org.spongepowered.asm.mixin.injection.throwables.InvalidInjectionException: @At("INVOKE") on net/minecraft/class_338::dontClearChatHistory with priority 1000 cannot inject into net/minecraft/class_338::method_1808(Z)V merged by coffee.waffle.dcch.mixin.DCCHMixin with priority 1000 [PREINJECT Applicator Phase -> ommc.mixins.json:feature.dontClearChatHistory.MixinChatHud from mod ommc-1_20_1 -> Prepare Injections ->  -> handler$fdd000$ommc-1_20_1$dontClearChatHistory(ZLorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V -> Prepare]
```

解决方案：

删除掉其中任意一个模组

### Mod 版本 / Mod 所适用的 Minecraft 版本错误










