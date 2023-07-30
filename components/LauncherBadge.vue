<script setup lang="ts">
defineProps<{
  text?: string
  type?: 'bakaxl' | 'hmcl' | 'pcl'
}>()
</script>

<template>
  <span class="LauncherBadge" :class="type">
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.LauncherBadge {
  display: inline-block;
  margin-left: 2px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 8px;
  line-height: 18px;
  font-size: 12px;
  font-weight: 600;
  transform: translateY(-2px);
}

h1 .LauncherBadge,
h2 .LauncherBadge,
h3 .LauncherBadge,
h4 .LauncherBadge,
h5 .LauncherBadge,
h6 .LauncherBadge {
  vertical-align: text-top;
}

h2 .LauncherBadge {
  border-radius: 11px;
  line-height: 20px;
}

.LauncherBadge.bakaxl {
  border-color: var(--vp-badge-bakaxl-border);
  color: var(--vp-badge-bakaxl-text);
  background-color: var(--vp-badge-bakaxl-bg);
}

.LauncherBadge.hmcl {
  border-color: var(--vp-badge-hmcl-border);
  color: var(--vp-badge-hmcl-text);
  background-color: var(--vp-badge-hmcl-bg);
}

.LauncherBadge.pcl {
  border-color: var(--vp-badge-pcl-border);
  color: var(--vp-badge-pcl-text);
  background-color: var(--vp-badge-pcl-bg);
}
</style>