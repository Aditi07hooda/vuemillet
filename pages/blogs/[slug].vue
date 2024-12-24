<script setup>
import { parse, format } from 'date-fns'

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const route = useRoute()
const products = ref([])
const productsError = ref(null)
const sessionId = ref(null)

if (typeof window !== "undefined") {
    sessionId.value = localStorage.getItem("sessionId")
}

if (!sessionId.value) {
    sessionId.value = await createSessionId(baseURL, brandID)
}

const { data: blogData, error: blogError, loading: blogLoading } = await useFetch(`${baseURL}/store/${brandID}/blogs/${route.params.slug}`)

const handleFetchProductDetails = async (productKeys) => {
    try {
        const productPromises = productKeys.map(async key => {
            const productData = await $fetch(`${baseURL}/store/${brandID}/products/${key}`, {
                headers: {
                    session: sessionId.value
                }
            })
            return productData
        })
        products.value = await Promise.all(productPromises)
    } catch (err) {
        console.error('Error fetching products:', err)
        productsError.value = err
    }
}

if (blogData.value && blogData.value.products) {
    await handleFetchProductDetails(blogData.value.products)
} else if (blogError.value) {
    console.error('Error fetching blog:', blogError.value)
}

const formatDate = (dateString) => {
    try {
        const parsedDate = parse(dateString, "dd/MM/yyyy", new Date())
        return format(parsedDate, "d MMMM, yyyy")
    } catch (error) {
        console.error("Error formatting date:", error)
        return "Invalid Date"
    }
}

const containsOnlyNull = (array) => {
    return array.every(entry => entry === null)
}
</script>

<template>
    <div>
        <div v-if="blogLoading">Loading...</div>
        <div v-else-if="blogError">Error: {{ blogError.message }}</div>
        <div v-else-if="blogData">
            <h1 class="text-center my-5 uppercase">{{ blogData.title }}</h1>
            <div v-if="blogData.image" class="hero-container">
                <img :src="blogData.image" :alt="blogData.slug" class="hero-image rounded-lg" />
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
                <div class="mb-7 mt-0 italic">By The Millet Store - {{  formatDate(blogData.created)}}</div>
                <div v-html="blogData.content"></div>
                <div class="rounded-lg border-black p-7 text-center bg-green-100 mt-5">
                    By The Millet Store - {{ formatDate(blogData.created) }}
                </div>
                <div v-if="products.length !== 0 && !containsOnlyNull(products)">
                    <h2 class="mt-10 mb-5">You might like to buy {{ products.length > 1 ?
                        "these products" : "this product"
                        }} :</h2>
                    <div class="product-list flex flex-wrap justify-evenly p-14">
                        <div class="text-center p-5">
                            You can buy the following products from us and we deliver it to your home.
                            We use only organic ingredients and all the products are made only after you place the
                            order.
                        </div>
                        <div v-if="products.length !== 0" class="flex justify-evenly w-full flex-wrap">
                            <div v-for="product in products.filter(p => p !== null)" :key="product.slug"
                                class="product-container rounded mb-10 mx-2 w-full sm:w-auto">
                                <BlogProduct :product="product" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-container {
    flex: 1 1 calc(25% - 10px);
    max-width: 250px;
    text-align: center;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background-color: #e9d8fd;
    border-radius: 8px;
}

@media (max-width: 768px) {
    .product-list {
        padding: 5px;
        gap: 5px;
    }

    .product-container {
        flex: 1 1 calc(50% - 10px);
    }
}

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