<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { loadLegacyCardScripts } from './legacy/loadLegacyCardScripts'

const shellMarkup = ref('')

onMounted(async () => {
  const shellTemplate = document.getElementById('legacy-card-shell')
  shellMarkup.value = shellTemplate?.innerHTML ?? ''

  await nextTick()
  await loadLegacyCardScripts()
})
</script>

<template>
  <div class="legacy-card-host" v-html="shellMarkup"></div>
</template>

<style scoped>
.legacy-card-host {
  min-height: 100dvh;
}
</style>
