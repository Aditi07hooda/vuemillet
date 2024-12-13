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
    console.log("sessionid", sessionId.value)
}


const { data: categories, error: categoriesError, loading: categoriesLoading } = await useFetch(`${baseURL}/store/${brandID}/categories?`, {
    headers: {
        session: sessionId.value,
    },
})
const products = ref(categories.value.filter(x => x.slug === route.params.slug))
console.log("categories in each category page", categories.value, route.params.slug)
console.log("individual category", categories.value.filter(x => x.slug === route.params.slug))
console.log('product in each categoru p;a', products.value)

</script>
<template>
    <div>
        <h1>{{ products[0]?.name }}</h1>
        <img :src="products[0]?.imageUrl" alt="h" />
        <div v-html="products[0]?.description"></div>
        <div v-if="products.length !== 0" class="flex justify-evenly w-full flex-wrap">
            <div v-for="product in products[0].products" :key="product.id"
                class="product-container rounded mb-10 mx-2 w-full sm:w-auto">
                <BlogProduct :product="product" />
            </div>
        </div>
    </div>
    This is the each category's product page
</template>
<style>
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