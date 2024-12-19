<script setup>
import { ref } from "vue"
import { useFetch } from "#app"
import { useRoute } from 'vue-router'
import { capitalize } from "../../composables/capitalize"

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const sessionId = ref(null)
const route = useRoute()
const sortOrder = ref('asc')

if (typeof window !== "undefined") {
    sessionId.value = localStorage.getItem("sessionId")
}

const { data: categories, error: categoriesError, loading: categoriesLoading } = await useFetch(`${baseURL}/store/${brandID}/categories?`, {
    headers: {
        session: sessionId.value
    }
})

const products = ref(categories.value.filter(x => x.slug === route.params.slug))

const sortedProducts = computed(() => {
    if (sortOrder.value === 'desc') {
        return products.value[0].products.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortOrder.value === 'asc') {
        return products.value[0].products.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder.value === 'low') {
        return products.value[0].products.sort((a, b) => a.variants[0].offerPrice - b.variants[0].offerPrice)
    } else if (sortOrder.value === 'high') {
        return products.value[0].products.sort((a, b) => b.variants[0].offerPrice - a.variants[0].offerPrice)
    }
})

console.log('product in each category', products.value)
</script>

<template>
    <div v-if="categoriesLoading">Loading...</div>
    <div v-else-if="categoriesError">Error: {{ error.message }}</div>
    <div v-else>
        <div class="flex flex-wrap px-14 gap-4 font-bold mt-4 justify-center">
            <NuxtLink :to="`/category/${category.slug}`" v-for="category in categories" :key="category" class="nuxtlink"
                :class="category.slug === route.params.slug ? 'active' : 'transparent-underline '">
                {{ capitalize(category.name) }}
            </NuxtLink>
        </div>
        <div class="hero-image px-14 mt-7">
            <img :src="products[0]?.imageUrl" alt="image" />
            <div class="hero-overlay">
                <h1 class="text-center uppercase">{{ products[0]?.name }}</h1>
            </div>
        </div>
        <div class="p-14 description" v-html="products[0]?.description"></div>
        <div class="px-14 text-end mb-4">
            <select v-model="sortOrder" @change="console.log('sort', sortOrder, sortedProducts)">
                <option value="asc">Alphabetically (A-Z)</option>
                <option value="desc">Alphabetically (Z-A)</option>
                <option value="low">Price (Low to High)</option>
                <option value="high">Price (High to Low)</option>
            </select>
        </div>
        <div v-if="products.length !== 0" class="flex justify-evenly w-full flex-wrap">
            <div v-for="product in sortedProducts" :key="product.id"
                class="product-container rounded mb-10 mx-1 w-full sm:w-auto">
                <BlogProduct :product="product" />
            </div>
        </div>
    </div>
</template>

<style scoped>
select {
    appearance: none;
    /* Remove default styling */
    -webkit-appearance: none;
    /* For Safari */
    -moz-appearance: none;
    /* For Firefox */

    /* Dropdown styling */
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 40px 10px 15px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    outline: none;
    width: 200px;

    /* Add space for the down arrow */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333' width='18' height='18'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
}

select:hover {
    border-color: #888;
}

select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.active,
.nuxtlink:hover {
    color: #94734c;
    border-bottom: 1px solid #94734c;
}

.transparent-underline {
    border-bottom: 1px solid transparent;
}

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