<template>
  <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  
  const windowHeight = scrollHeight - clientHeight
  progress.value = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  z-index: 99999;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px var(--vp-c-brand-soft);
}
</style>
