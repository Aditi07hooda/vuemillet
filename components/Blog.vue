<template>
    <div v-for="blog in blogs" :key="blog.slug"
        class="blog-item me-1 flex flex-col justify-between mb-10 rounded-3xl background">
        <div>
            <div class="flex justify-center">
                <img :src="blog.image || '/favicon.ico'" alt="alt" class="rounded-3xl" />
            </div>
            <div class="p-4">
                <h3 class="truncate">
                    {{ blog.title }}
                </h3>
                <div class="truncate">
                    {{ blog.snippet || blog.title }}
                </div>
            </div>
        </div>
        <div class="flex details justify-between uppercase  border-color p-4 border-t" style="border-color: 'red'">
            <div class="p-2">
                {{ blog.created }}
            </div>
            <div
                class="rounded-full border border-gray-800 p-2 text-center hover:bg-pink-400  hover:text-white transition duration-500 ">
                Read the article
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    blogs: {
        type: Array,
        required: true,
    },
})
</script>

<style scoped>
.blog-item {
    max-height: 350px;
    width: 300px;
    height: 350px;
    color: #67645b;
}

h3 {
    font-size: 20px;
    font-weight: 600;
}

.details {
    font-size: 12px;
    font-weight: 400;
}

img {
    width: 300px;
    height: 200px;
}

.border-color {
    border-color: #01070d !important;
}
</style>