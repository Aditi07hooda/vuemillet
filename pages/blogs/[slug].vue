<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="data">
            <h1 class="text-center my-5 uppercase">{{ data.title }}</h1>
            <div v-if="data.image" class="hero-container">
                <img  :src="data.image" :alt="data.slug" class="hero-image" />
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
                    By The Millet Store - {{ data.created }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useFetch } from '#app';

const route = useRoute();
const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID

const { data, error, loading } = await useFetch(`${baseURL}/store/${brandID}/blogs/${route.params.slug}`)

if (error.value) {
    console.error('Error fetching blog:', error.value);
}
console.log("data", data)
</script>

<style>
.hero-container {
    display: flex;
    justify-content: center;
    /* Centers the image horizontally */
    align-items: center;
    /* Centers the image vertically */
    height: 90vh;
    /* Covers a large portion of the viewport height */
    width: 100%;
    /* Full width of the page */
    overflow: hidden;
    /* Prevents the image from overflowing */
    /* background-color: #f3f3f3; */
    /* Optional: fallback background color */
}

.hero-image {
    max-width: 100%;
    /* Scales down the image to fit the width */
    max-height: 100%;
    /* Ensures it fits the height without breaking aspect ratio */
    object-fit: cover;
    /* Ensures the image fills the container while maintaining aspect ratio */
}

h1 {
    /* color: #768451; */
    font-size: 40px;
}

.details {
    font-size: 20px;
}
</style>