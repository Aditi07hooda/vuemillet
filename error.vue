<script setup>
import { clearError } from '#app'

const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <NotFound />
    <button @click="handleError">Clear errors</button>
  </div>
</template>
