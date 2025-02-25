<script setup>
import { parse, format } from "date-fns";

defineProps({
  blog: {
    type: Object,
    required: true,
  },
});

const route = useRoute();

const formatDate = (dateString) => {
  try {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return format(parsedDate, "d MMMM, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
</script>

<template>
  <NuxtLink :to="`/blogs/${blog.slug}`">
    <div
      class="w-fit h-[200px] rounded-xl overflow-hidden flex justify-center items-center place-self-center"
    >
      <img
        :src="blog.image || '/favicon.ico'"
        alt="Blog Image"
        class="w-full h-full object-contain rounded-3xl"
      />
    </div>
    <div class="px-4 mt-2">
      <h3 class="truncate">
        {{ blog.title }}
      </h3>
      <div v-if="route.path !== '/'" class="truncate">
        {{ blog.snippet || blog.title }}
      </div>
    </div>
    <div
      v-if="route.path !== '/'"
      class="flex details justify-between uppercase border-color p-4 border-t"
    >
      <div class="p-2">
        {{ formatDate(blog.created) }}
      </div>
      <div
        class="rounded-full border border-gray-800 p-2 text-center hover:bg-pink-400 hover:text-white hover:border-pink-400 transition duration-500"
      >
        Read the article
      </div>
    </div>
    <div v-if="route.path === '/'" class="px-4 uppercase underline text-end">
      Read more
    </div>
  </NuxtLink>
</template>

<style scoped>
h3 {
  font-size: 20px;
  font-weight: 600;
}

.details {
  font-size: 12px;
  font-weight: 400;
}

.border-color {
  border-color: #01070d !important;
}
</style>
