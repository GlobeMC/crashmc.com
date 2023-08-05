<template>
  <div class="author" v-if="$frontmatter.author">
    <span>本文作者：{{ $frontmatter.author }}</span>
  </div>
</template>

<style scoped>
.author {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-align: right;
  margin-right: 1px;
}

@media (min-width: 640px) {
  .author {
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
    margin-right: 1px;
  }
}
</style>