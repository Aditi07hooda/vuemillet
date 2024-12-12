<template>
    <div>
        <div v-if="productLoading">Loading...</div>
        <div v-else-if="productError">Error: {{ error.message }}</div>
        <div v-else>
            <div>
                <h2>Categories</h2>
                <div v-for="category in categories" :key="category.id">
                    <div class="image-container">
                        <img :src="category.imageUrl" :alt="category.name" />
                    </div>
                    {{ category.name }}
                </div>
            </div>
            <!-- <div v-for="product in products" :key="product.id">
                <div class="text-5xl font-bold tracking-tight py-4">
                    {{ product.name }}
                </div>
                <div class="mt-10 text-2xl">
                    <h2 class="font-medium  text-gray-900">Description</h2>
                    <div class="mt-4 text-gray-500 dancing-script">
                        <div v-html="product.description"></div>
                    </div>
                </div>
                <div class="mt-8 text-2xl">
                    <h2 class="font-medium text-gray-900">Ingredients</h2>
                    <div class="mt-4 text-gray-500 dancing-script">
                        <p>
                            {{ product.ingredients.toString() }}
                        </p>
                    </div>
                </div>
                <div class="mt-6 flex flex-col gap-4">
                    <select id="o_variant" name="o_variant" class="variant-select">
                        <option v-for="(option, index) in product.variants" :key="index"
                            :value="JSON.stringify(option)">
                            {{ option.name }}
                        </option>
                    </select>
                </div>
            </div> -->
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

console.log("category", categories.value)
</script>

<style>
/* Add any page-specific styles here */
</style>