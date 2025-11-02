<template>
  <div class="p-6">
    <h1>OBS Controller</h1>
    <p>Scena attuale: {{ current }}</p>

    <button @click="loadScenes">Aggiorna Scene</button>

    <ul>
      <li v-for="scene in scenes" :key="scene.sceneName">
        <button @click="setScene(scene.sceneName)">
          {{ scene.sceneName }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scenes = ref([])
const current = ref('')

async function loadScenes() {
  const res = await fetch('http://localhost:3001/api/scenes')
  const data = await res.json()
  scenes.value = data.scenes
  current.value = data.currentProgramSceneName
}

async function setScene(name) {
  await fetch('http://localhost:3001/api/scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
  loadScenes()
}

loadScenes()
</script>
