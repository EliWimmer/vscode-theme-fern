<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'

// This will cause a TS error (invalid type)
const invalidProp = defineProps<{
  status: 'active' | 'pending' | 123  // Numbers aren't valid in string unions
}>()

const count = ref<number>(0)
const message = ref<string>('Hello')
const items = ref<string[]>(['a', 'b', 'c'])

// This will cause a Vue warning (computed getter shouldn't have side effects)
const badComputed = computed(() => {
  count.value++  // Side effect!
  return count.value * 2
})

const doubledCount = computed(() => count.value * 2)

interface User {
  id: number
  name: string
}

const user = ref<User>({
  id: 1,
  name: 'Test'
})

function handleClick(event: MouseEvent): void {
  console.log(`Clicked at: ${event.clientX}, ${event.clientY}`)
  count.value += 1
}

onMounted(() => {
  console.log('Component mounted!')
})
</script>

<template>
  <div class="container">
    <h1 :class="{ active: count > 0 }">{{ message }}</h1>

    <button
      @click="handleClick"
      :disabled="count > 10"
    >
      Click me ({{ count }})
    </button>

    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        :data-index="index"
      >
        {{ item.toUpperCase() }}
      </li>
    </ul>

    <p>{{ user.name }} - ID: {{ user.id }}</p>

    <!-- Template expression -->
    <span>{{ doubledCount + 5 * 2 }}</span>
  </div>
</template>

<style scoped>
.container {
  @apply bg-gray-100;
  padding: 1rem;
}

h1.active {
  color: #ff0000;
  font-weight: bold;
}

button {
  &:hover {
    background-color: #eee;
  }

  &:disabled {
    opacity: 0.5;
  }
}
</style>
