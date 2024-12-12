<template>
    <div>
        <div v-if="productLoading">Loading...</div>
        <div v-else-if="productError">Error: {{ error.message }}</div>
        <div v-else>
            <div>
                <h2>Categories</h2>
                <div class="">
                    <UCarousel v-slot="{ item }" :items="categories"
                        :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 flex flex-col gap-4' }" indicators
                        class="rounded-lg overflow-hidden">
                        <div class="w-full space-y-4 px-2">
                            <img :src="item.imageUrl" class="w-full rounded-3xl shadow-md" draggable="false">
                            <p class="text-sm mt-2 text-center">{{ item.name }}</p>
                        </div>
                    </UCarousel>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useFetch } from "#app"
import { createSessionId } from "~/composables/session" // Import the session function

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

// Using `useFetch` to fetch data directly. usefetch calls function onMount
const { data: products, error: productError, loading: productLoading } = useFetch(`${baseURL}/store/${brandID}/products`, {
    headers: {
        session: sessionId.value,
    },
})

const { data: categories, error: categoriesError, loading: categoriesLoading } = useFetch(`${baseURL}/store/${brandID}/categories?`, {
    headers: {
        session: sessionId.value,
    },
})

let items = []
if (categories.value) {
    items = categories.value.map(category => category.imageUrl)
}
console.log("category", categories.value)

</script>

<style>

</style>