<!-- <template>
  <div class="author" v-if="$frontmatter.author">
    <span>本文作者:  {{ $frontmatter.author }}</span>
  </div>
</template> -->

<template>
  <p class="Author">本文作者 : {{ $frontmatter.author }}</p>
</template>

<style scoped>
.Author {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
}

@media (min-width: 640px) {
  .Author {
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
