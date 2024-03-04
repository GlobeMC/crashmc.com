<script setup lang="ts">
import { ref, onMounted } from "vue"
import { onAuthDone } from "@/auth/github"

const REDIRECT_TIMEOUT_SEC = 3

const loading = ref(true)
const failed = ref(false)
const redirectTarget = ref("")
const redirectLeft = ref(REDIRECT_TIMEOUT_SEC)

function startRedirectInterval(): void {
	const intId = setInterval(() => {
		const left = (redirectLeft.value -= 1)
		if (left <= 0) {
			clearInterval(intId)
			window.location.replace(redirectTarget.value)
		}
	}, 1000)
}

onMounted(async () => {
	let redirectTo = await onAuthDone()
	if (!redirectTo) {
		redirectTo = "/"
		failed.value = true
	}
	loading.value = false
	redirectTarget.value = redirectTo
	startRedirectInterval()
})
</script>

<template>
	<div class="box">
		<div v-if="loading">登录中, 请稍后</div>
		<div v-else-if="redirectLeft > 0">
			<div v-if="failed" class="failed">登录失败.</div>
			<div v-else class="success">登录成功!</div>
			{{ redirectLeft }} 秒后跳转<span v-if="failed">到主页</span>
			<br />
			没有跳转? 点击<a :href="redirectTarget">这里</a>
		</div>
		<a href="/">返回主页</a>
	</div>
</template>

<style scoped>
.box {
	text-align: center;
}

.failed {
	font-size: 1.2rem;
	color: red;
}

.success {
	font-size: 1.2rem;
	color: green;
}
</style>
