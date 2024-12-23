<script setup>
defineProps({
    categories: {
        type: Object,
        required: true
    },
    close: {
        type: Boolean
    }
})
const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const sessionId = ref(null)
const searchQuery = ref('')
const searchResults = ref('')

if (typeof window !== "undefined") {
    sessionId.value = localStorage.getItem("sessionId")
}

if (!sessionId.value) {
    sessionId.value = await createSessionId(baseURL, brandID)
}

const handleShowSearchResults = async () => {
    try {
        const results = await fetch(`${baseURL}/store/${brandID}/search?q=${searchQuery.value}`)
        const response = await results.json()
        searchResults.value = response
    }
    catch (e) {
        console.error("Error in fetching results", e)
    }
}
</script>

<template>
    <h3 class="uppercase text-center text-lg font-semibold pt-3 text-white">Search by name</h3>
    <div class="px-14 m-5 mt-2 flex w-full">
        <div class="relative w-full">
            <UInput v-model="searchQuery" class="w-full pr-12" placeholder="Search products by name..." />
            <div @click="handleShowSearchResults"
                class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-800">
                <LucideSearch />
            </div>
        </div>
    </div>
    <div class="flex flex-wrap md:flex-nowrap m-5 w-full mb-36 mx-20 mt-8 gap-6 sm:gap-4 text-white">
        <div class="md:w-1/4 w-full">
            <div class="flex flex-col">
                <h3 class="uppercase text-lg font-semibold py-3">All Categories</h3>
                <ul class="flex flex-col space-y-4">
                    <li v-for="category in categories" :key="category.id"
                        class="flex gap-3 text-sm font-medium items-center hover:text-pink-600 hover:scale-105 transition duration-500">
                        <NuxtLink :to="`/category/${category.slug}`" @click="close">
                            {{ capitalize(category.name) }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="!searchResults" class="md:w-3/4 w-full">
            <h3 class="uppercase text-lg font-semibold py-3">By Categories</h3>
            <div class="flex gap-4 flex-wrap">
                <div v-for="category in categories" :key="category.id" class="">
                    <NuxtLink :to="`/category/${category.slug}`" @click="close"
                        class="flex flex-col items-center hover:text-pink-600 hover:scale-105 transition duration-500">
                        <img :src="category.imageUrl" :alt="category.name"
                            class="w-[150px] h-[150px] object-cover rounded-lg" />
                        <div class="w-[150px] mt-2 font-semibold">{{ category.name }}</div>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else class="md:w-3/4 w-full">
            <h3 class="uppercase text-lg font-semibold py-3">
                {{ searchResults.term ?
                    `All search results for ${searchResults.term}` :
                    "Recommended products" }}
            </h3>
            <div class="flex flex-wrap gap-4">
                <div v-for="product in searchResults.results" :key="product.id">
                    <NuxtLink :to="`/product/${product.id}`" @click="close"
                        class="flex flex-col items-center hover:text-pink-600 hover:scale-105 transition duration-500">
                        <img :src="product.oneImg" :alt="product.name"
                            class="w-[150px] h-[150px] object-cover rounded-lg" />
                        <div class="w-[150px] mt-2 font-semibold"> {{ capitalize(product.name) }} </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
