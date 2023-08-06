<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import members from "../../data/members"

const defaultAuthor = "GlobeMC"
const { frontmatter } = useData()

const contributors = computed(() => {
  return [
    frontmatter.value?.author,
    ...(frontmatter.value.contributors || []),
  ].filter((x) => x)
})

function getAvatarUrl(name: string) {
  return members.find((member) => { return member.name === name })?.avatar
}

function getGithubLink(name: string) {
  return `https://github.com/${name}`
}

function isNotEmpty(arr: string | string[]) {
  return Array.isArray(arr) && arr.length
}
</script>

<template>
  <p class="vp-main-color con">本文贡献者:</p>
  <div v-if="isNotEmpty(contributors)" class="flex flex-wrap gap-4">
    <div v-for="contributor of contributors" :key="contributor" class="flex gap-2 items-center vp-main-color">
      <a :href="getGithubLink(contributor)" rel="noreferrer" target="_blank">
        <img :src="getAvatarUrl(contributor)" class="w-8 h-8 rounded-full" />
      </a>
      <p class="vp-main-color">{{ contributor }}</p>
    </div>
  </div>
  <div v-else class="flex gap-2 items-center">
    <a :href="getGithubLink(defaultAuthor)" rel="noreferrer" target="_blank">
      <img :src="getAvatarUrl(defaultAuthor)" class="w-8 h-8 rounded-full" />
    </a>
    <p class="vp-main-clolr">{{ "GlobeMC" }}</p>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.flex-warp {
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
  margin-bottom: 6px;
}
</style>
