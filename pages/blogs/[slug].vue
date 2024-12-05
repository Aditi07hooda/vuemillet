<script setup>
import { useRoute } from 'vue-router'
import { useFetch } from '#app'
import { parse, format } from 'date-fns'
import { ref } from 'vue'

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const route = useRoute()
const products = ref([])
const productsError = ref(null)

const { data: blogData, error: blogError, loading: blogLoading } = await useFetch(`${baseURL}/store/${brandID}/blogs/${route.params.slug}`)

if (blogError.value) {
    console.error('Error fetching blog:', blogError.value)
}

const handleFetchProductDetails = async (productKeys) => {
    try {
        const sessionId = localStorage.getItem('sessionId')
        if (!sessionId) {
            console.error("session id not found")
            return;
        }
        const productPromises = productKeys.map(async key => {
            const { data: proData } = await useFetch(`${baseURL}/store/${brandID}/products/${key}`, {
                headers: {
                    session: sessionId
                }
            })
            return proData.value
        })
        products.value = await Promise.all(productPromises)
    }
    catch (err) {
        console.error('Error fetching products:', err)
        productsError.value = err
    }
}

if (blogData.value && blogData.value.products) {
    await handleFetchProductDetails(blogData.value.products)
} else if (blogError.value) {
    console.error('Error fetching blog:', blogError.value)
}

console.log("product", products.value)

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
        <div v-if="blogLoading">Loading...</div>
        <div v-else-if="blogError">Error: {{ blogError.message }}</div>
        <div v-else-if="blogData">
            <h1 class="text-center my-5 uppercase">{{ blogData.title }}</h1>
            <div v-if="blogData.image" class="hero-container">
                <img :src="blogData.image" :alt="blogData.slug" class="hero-image" />
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
                <div class="mb-7 mt-0 italic">By The Millet Store - {{ blogData.created }}</div>
                <div v-html="blogData.content"></div>
                <div class="rounded-lg border-black p-7 text-center mt-7 bg-green-100">
                    By The Millet Store - {{ formatDate(blogData.created) }}
                </div>
                <h2 class="my-5">You may like to buy this :</h2>
                <BlogProduct />
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

h2 {
    font-size: 25px;
}

.details {
    font-size: 20px;
}
</style>