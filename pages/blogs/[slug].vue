<script setup>
import { useRoute } from 'vue-router'
import { useFetch } from '#app'
import { parse, format } from 'date-fns'

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const route = useRoute()

const { data, error, loading } = await useFetch(`${baseURL}/store/${brandID}/blogs/${route.params.slug}`)

if (error.value) {
    console.error('Error fetching blog:', error.value)
}

const formatDate = (dateString) => {
    try {
        const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
        return format(parsedDate, "d MMMM, yyyy")
    } catch (error) {
        console.error("Error formatting date:", error)
        return "Invalid Date"
    }
}
</script>

<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="data">
            <h1 class="text-center my-5 uppercase">{{ data.title }}</h1>
            <div v-if="data.image" class="hero-container">
                <img :src="data.image" :alt="data.slug" class="hero-image" />
            </div>
            <div class="m-14 p-14 pt-0 mt-5 mb-0">
                <div class="flex details items-center justify-between py-2">
                    <div class="flex items-center">
                        <NuxtLink to="/">
                            <LucideHome />
                        </NuxtLink>
                        <div
                            class="ms-2  font-bold rounded-full border border-green-700 hover:bg-green-700 hover:text-white transition duration-500  p-2 px-8">
                            <NuxtLink to="/blogs">
                                All
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="flex ms-2">
                        <span> Share the article </span>
                        <span class="ms-2 flex items-center">
                            <LucideFacebook />
                        </span>
                        <span class="ms-2 flex items-center">
                            <LucideInstagram />
                        </span>
                    </div>
                </div>
                <div class="mb-7 mt-0 italic">By The Millet Store - {{ data.created }}</div>
                <div v-html="data.content"></div>
                <div class="rounded-lg border-black p-7 text-center mt-7 bg-green-100">
                    By The Millet Store - {{ formatDate(data.created) }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.hero-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    width: 100%;
    overflow: hidden;
   }

.hero-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

h1 {
    font-size: 40px;
}

.details {
    font-size: 20px;
}
</style>