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

const brandInfo = ref({
  tags: [],
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

onMounted(async () => {
  const data = await fetchBrandInfo(baseURL, brandID);
  brandInfo.value.tags = [
    ...data.brand.brandHighlights,
    ...data.brand.metaTags,
  ];
});
</script>
<template>
  <div
    class="bg-green-700 w-full flex overflow-auto justify-evenly items-center px-4 py-1"
  >
    <div v-for="tag in brandInfo.tags" class="flex justify-evenly w-full">
      <span
        class="inline-block px-2 py-1 text-lg font-semibold text-white rounded-full w-full"
        >{{ capitalize(tag.name) }}</span
      >
      <span
        class="inline-block px-2 py-1 text-lg font-semibold text-white rounded-full w-fit"
      >
        *
      </span>
    </div>
  </div>
</template>
