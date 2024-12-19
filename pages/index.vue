<template>
    <div>
        <div v-if="productLoading">Loading...</div>
        <div v-else-if="productError">Error: {{ error.message }}</div>
        <div v-else>
            <div>
                <h2 class="text-center"> Prioritizing Holistic Health </h2>
                <h3 class="text-center mb-4">
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
                                    class="text-sm mt-2 text-center border border-black border-2 rounded-3xl p-2 w-1/2  hover:bg-pink-600 transition duration-500 ">
                                    {{
                                        item.name }}</p>
                            </div>
                        </NuxtLink>
                    </div>
                </UCarousel>
                <div class="text-center my-5">
                    <h2 class="uppercase">Commited to being education first</h2>
                    <h3 class="mb-2">Learn with us as we dive deeper into root causes and all about that holistic life!
                    </h3>
                    <h3 class="uppercase underline">
                        <NuxtLink to="/blogs"> Our Blogs </NuxtLink>
                    </h3>
                    <div class="p-8">
                        <Splide :options="{
                            rewind: true, perPage: 4, gap: '1rem',
                            breakpoints: {
                                768: {
                                    perPage: 2,
                                    gap: '0.5rem'
                                },
                                480: {
                                    perPage: 1,
                                    gap: '0.25rem'
                                }
                            }
                        }" aria-label="My Favorite Images">
                            <SplideSlide v-for="blog in blogs" :key="blog.slug" class="blog-item">
                                <Blog :blog="blog" />
                            </SplideSlide>
                        </Splide>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import '@splidejs/vue-splide/css'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
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

const { data: blogs, error: blogsError, loading: blogsLoading } = await useFetch(`${baseURL}/store/${brandID}/blogs`)

let items = []
if (categories.value) {
    items = categories.value.map(category => category.imageUrl)
}
console.log("category", categories.value)

</script>

<style scoped>
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
    font-family: "Futura PT";
}

h3 {
    font-family: "Futura PT";
    font-size: 20px;
}
</style>