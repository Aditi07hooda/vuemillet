<script setup>
import { ref } from "vue"
import { useFetch } from "#app"
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const sessionId = ref(null)
const route = useRoute()

if (typeof window !== "undefined") {
    sessionId.value = localStorage.getItem("sessionId")
}

const { data: categories, error: categoriesError, loading: categoriesLoading } = await useFetch(`${baseURL}/store/${brandID}/categories?`, {
    headers: {
        session: sessionId.value,
    },
})

const products = ref(categories.value.filter(x => x.slug === route.params.slug))

console.log('product in each category', products.value)
</script>

<template>
    <div>
        <div class="flex flex-wrap px-14 gap-4 font-bold mt-4">
            <NuxtLink :to="`/category/${category.slug}`" v-for="category in categories" :key="category">{{ category.name }}</NuxtLink>
        </div>
        <div class="hero-image px-14 mt-7">
            <img :src="products[0]?.imageUrl" alt="image" />
            <div class="hero-overlay">
                <h1 class="text-center uppercase">{{ products[0]?.name }}</h1>
            </div>
        </div>
        <div class="p-14 description" v-html="products[0]?.description"></div>
        <div v-if="products.length !== 0" class="flex justify-evenly w-full flex-wrap">
            <div v-for="product in products[0].products" :key="product.id"
                class="product-container rounded mb-10 mx-1 w-full sm:w-auto">
                <BlogProduct :product="product" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.hero-image {
    position: relative;
    width: 100%;
    height: 50vh;
    overflow: hidden;
}

.hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 10px;
}

.hero-overlay h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-overlay p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}


@media (max-width: 768px) {
    .hero-overlay h1 {
        font-size: 2rem;
    }

    .hero-overlay p {
        font-size: 1rem;
    }

    .hero-overlay button {
        font-size: 0.9rem;
        padding: 8px 16px;
    }
}

.description {
    font-size: 20px;
    font-family: "Futura PT";
}

.product-container {
    flex: 1 1 calc(25% - 10px);
    max-width: 250px;
    text-align: center;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .product-container {
        flex: 1 1 calc(50% - 10px);
    }
}
</style>