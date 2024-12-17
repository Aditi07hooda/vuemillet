<script setup>
const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const route = useRoute()
const { data: product, error, loading } = await useFetch(`${baseURL}/store/${brandID}/products/${route.params.slug}`)
console.log("data of each product", product.value, route.params)

</script>
<template>
    This is each products page
</template>
<style></style>