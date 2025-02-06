<script setup>
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const sessionId = ref(null);

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

// const {
//   data: categories,
//   error: categoriesError,
//   loading: categoriesLoading,
// } = useFetch(`${baseURL}/store/${brandID}/categories?`, {
//   headers: {
//     session: sessionId.value,
//   },
// });

const {
  data: collection,
  error: collectionError,
  loading: collectionLoading,
} = useFetch(`${baseURL}/store/${brandID}/collections`, {
  headers: {
    session: sessionId.value,
  },
});
</script>

<template>
  <div v-if="categoriesLoading">Loading...</div>
  <div v-else-if="categoriesError">Error: {{ categoriesError.message }}</div>
  <div v-else>
    <SearchPopover :collections="collection" />
  </div>
</template>
