<template>
    <div>
        <div v-if="categoriesLoading || blogsLoading">Loading...</div>
        <div v-else-if="categoriesError || blogsError">
            <div v-if="categoriesError">Categories Error: {{ categoriesError.message }}</div>
            <div v-if="blogsError">Blogs Error: {{ blogsError.message }}</div>
        </div>
        <div v-else>
            <h2 class="text-center mt-5">Prioritizing Holistic Health</h2>
            <h3 class="text-center mb-10">
                Overwhelmed by quick fixes and diet culture, we bring you nutritious, healthy and yet very delicious
                items
            </h3>
            <UCarousel v-slot="{ item }" :items="categories"
                :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 flex flex-col gap-4' }" indicators
                class="rounded-lg overflow-hidden">
                <div class="w-full space-y-4 px-2">
                    <NuxtLink :to="`/category/${item.slug}`">
                        <img :src="item.imageUrl" class="w-full rounded-3xl shadow-md" draggable="false">
                        <div class="flex justify-center">
                            <p
                                class="text-sm mb-10 mt-2 text-center border border-black border-2 rounded-3xl p-2 w-1/2 hover:bg-pink-600 transition duration-500">
                                {{ item.name }}
                            </p>
                        </div>
                    </NuxtLink>
                </div>
            </UCarousel>
            <div>
                <h2 class="text-center mt-5">
                    Shop the essentials
                </h2>
                <div class="p-8">
                    <UCarousel v-slot="{ item }" :items="products.results"
                        :ui="{ container: 'gap-4', item: 'flex flex-col items-center', nav: 'hidden' }" indicators>
                        <div class="blog-item">
                            <div class="product-container rounded mb-10 mx-1 w-full sm:w-auto">
                                <BlogProduct :product="item" />
                            </div>
                        </div>
                    </UCarousel>
                </div>
            </div>
            <div class="text-center my-5">
                <h2 class="uppercase">Commited to being education first</h2>
                <h3 class="mb-2">Learn with us as we dive deeper into root causes and all about that holistic life!</h3>
                <h3 class="uppercase underline">
                    <NuxtLink to="/blogs">Our Blogs</NuxtLink>
                </h3>
                <div class="p-8">
                    <UCarousel v-slot="{ item }" :items="blogs"
                        :ui="{ container: 'gap-4', item: 'flex flex-col items-center', nav: 'hidden' }" indicators>
                        <div class="blog-item">
                            <Blog :blog="item" />
                        </div>
                    </UCarousel>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
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

const { data: categories, error: categoriesError, loading: categoriesLoading } = useFetch(`${baseURL}/store/${brandID}/categories?`, {
    headers: {
        session: sessionId.value,
    },
})

const { data: blogs, error: blogsError, loading: blogsLoading } = await useFetch(`${baseURL}/store/${brandID}/blogs`)
const { data: products, error: productsError, loading: productsLoading } = await useFetch(`${baseURL}/store/${brandID}/search?q=`)
console.log('recom product', products.value)


</script>

<style>
* {
    font-family: "Futura PT";
}

.blog-item {
    max-height: 350px;
    width: 300px;
    height: 350px;
    color: #67645b;
}

h2 {
    font-weight: 900;
    font-size: 35px;
}

h3 {
    font-size: 20px;
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
</style>