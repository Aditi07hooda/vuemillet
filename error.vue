<script setup>
import { clearError } from "#app";

const props = defineProps({
  error: Object,
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <Navbar />
  <div>
    <NotFound :click="handleError" />
  </div>
  <Footer />
</template>
