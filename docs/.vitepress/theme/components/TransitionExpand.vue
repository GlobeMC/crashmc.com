<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
  }>(),
  {
    name: "v",
  },
)

const prefix = props.name

function waitForAnimationFrame() {
  return new Promise((re) => requestAnimationFrame(re))
}

async function onenter(elem) {
  elem.style.maxHeight = "unset"
  const width = window.getComputedStyle(elem).width
  elem.style.width = width
  elem.style.position = "absolute"
  elem.style.visibility = "hidden"
  elem.style.height = "auto"

  const height = window.getComputedStyle(elem).height
  elem.style.width = null
  elem.style.position = null
  elem.style.visibility = null
  elem.style.height = null
  elem.style.maxHeight = null
  elem.style.setProperty("--expanded-height", height)

  elem.classList.add(prefix + "-enter-from")
  await waitForAnimationFrame()
  elem.classList.add(prefix + "-enter-active")
  await waitForAnimationFrame()
  elem.classList.remove(prefix + "-enter-from")
  elem.classList.add(prefix + "-enter-to")
}

async function onleave(elem) {
  const height = window.getComputedStyle(elem).height
  elem.style.setProperty("--expanded-height", height)

  elem.classList.add(prefix + "-leave-from")
  await waitForAnimationFrame()
  elem.classList.add(prefix + "-leave-active")
  await waitForAnimationFrame()
  elem.classList.remove(prefix + "-leave-from")
  elem.classList.add(prefix + "-leave-to")
}

function onafter(elem) {
  elem.classList.remove(prefix + "-enter-active")
  elem.classList.remove(prefix + "-enter-to")
  elem.classList.remove(prefix + "-leave-active")
  elem.classList.remove(prefix + "-leave-to")
  elem.style.removeProperty("--expanded-height")
}
</script>

<template>
  <Transition
    name="expand"
    @enter="onenter"
    @after-enter="onafter"
    @before-leave="onleave"
    @after-leave="onafter">
    <slot />
  </Transition>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 1s ease-in-out;
  overflow-y: hidden !important;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: var(--expanded-height);
}
</style>
