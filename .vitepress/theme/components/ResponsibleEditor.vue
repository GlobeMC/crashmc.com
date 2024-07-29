<script setup lang="ts">
import { useData } from "vitepress"
import { computed } from "vue"
import { useCDN } from "@/cdn"

const defaultAuthor = "GlobeMC"
const { frontmatter } = useData()

const editor = computed(() => {
	return frontmatter.value?.editor
})

function getAvatarUrl(name: string) {
	return useCDN(`https://github.com/${name}.png`)
}

function getGitHubLink(name: string) {
	return `https://github.com/${name}`
}

// function isNotEmpty(arr: string | string[]) {
// 	return Array.isArray(arr) && arr.length
// }
</script>

<template>
	<p class="vp-main-color con">本文责任编辑:</p>
	<div v-if="editor" class="flex flex-wrap gap-4">
		<div class="flex gap-2 items-center vp-main-color">
			<a
				:href="getGitHubLink(editor)"
				rel="noreferrer"
				target="_blank"
				class="flex items-center gap-2">
				<img :src="getAvatarUrl(editor)" class="w-8 h-8 rounded-full" />
				<p class="vp-main-color">{{ editor }}</p>
			</a>
		</div>
	</div>
	<div v-else class="flex gap-2 items-center">
		<a
			:href="getGitHubLink(defaultAuthor)"
			rel="noreferrer"
			target="_blank"
			class="flex items-center gap-2">
			<img src="/logo-brand.webp" class="w-8 h-8 rounded-full" />
			<p class="vp-main-clolr">{{ "GlobeMC" }}</p>
		</a>
	</div>
</template>

<style scoped>
.flex {
	display: flex;
}

.flex-wrap {
	flex-wrap: wrap;
}

.gap-2 {
	grid-gap: 0.5rem;
	gap: 0.5rem;
}

.gap-4 {
	grid-gap: 1rem;
	gap: 1rem;
}

.items-center {
	align-items: center;
}

.w-8 {
	width: 2rem;
}

.h-8 {
	width: 2rem;
}

.rounded-full {
	border-radius: 9999px;
}

img {
	display: block;
	border: 0.1px solid var(--vp-c-brand);
}

p {
	line-height: 24px;
	/* font-size: 14px; */
	font-weight: 500;
	color: var(--vp-c-brand);
}

.con {
	margin-bottom: 5px;
}
</style>
