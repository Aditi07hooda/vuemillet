<script setup>
import { parse } from "date-fns";

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;

const { data, error, loading } = await useFetch(
  `${baseURL}/store/${brandID}/blogs`
);

const parseDate = (dateString) => {
  try {
    return parse(dateString, "dd/MM/yyyy", new Date()); // Using date-fns for parsing
  } catch (e) {
    console.error("Error parsing date:", dateString);
    return new Date(); // Return an invalid date if parsing fails
  }
};

const sortBlogsByDate = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return [];

  return [...data.value]
    .filter((blog) => blog.created)
    .sort((a, b) => {
      const dateA = parseDate(a.created);
      const dateB = parseDate(b.created);
      return dateB - dateA;
    });
});
</script>

<template>
  <Head>
    <Title>Blogs</Title>
  </Head>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="data && data.length">
    <div class="text-center my-4 p-5 mx-14">
      <h1 class="uppercase">The Millet Store Academy</h1>
      <div>Your weekly dose of wellness wisdom every Thursday!</div>
    </div>
    <div
      class="grid grid-flow-row grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-8 space-y-12"
    >
      <div v-for="blog in sortBlogsByDate" :key="blog.slug" class="blog-item">
        <Blog :blog="blog" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-item {
  width: 300px;
  color: #67645b;
}

h1 {
  color: #768451;
  font-size: 25px;
}
</style>
