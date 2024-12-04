<template>
    <div>This is the slug</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useFetch } from '#app';

const route = useRoute();
console.log("route", route)
// const { data: blog, error } = await useFetch(`/api/blog/${route.params.slug}`); // Adjust this API call to match your actual API endpoint

// if (error.value) {
//     console.error('Error fetching blog:', error.value);
// }
</script>
