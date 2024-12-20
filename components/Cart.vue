<script setup>
const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const sessionId = ref(null)

if (typeof window !== "undefined") {
    sessionId.value = localStorage.getItem("sessionId")
}

if (!sessionId.value) {
    sessionId.value = await createSessionId(baseURL, brandID)
}

const { data, error, loading } = useFetch(`${baseURL}/store/${brandID}/cart/full`, {
    headers: {
        session: sessionId.value,
    }
})

console.log('cart data', data.value)

</script>
<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else class="text-gray-600">
        This is cart component
    </div>
</template>

<style scoped></style>