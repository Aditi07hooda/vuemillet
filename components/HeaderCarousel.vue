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
    bannerWeb: [],
    bannerMobile: [],
});

onMounted(async () => {
  const data = await fetchBrandInfo(baseURL, brandID);
  console.log(data);
  brandInfo.value.bannerWeb = data.brand.banners;
  brandInfo.value.bannerMobile = data.brand.bannersForMobile;
  brandInfo.value.tags = data.brand.brandHighlights;
});
</script>
<template>
  <div>
    <h1>{{ brandInfo.bannerWeb }}</h1>
    <h1>{{ brandInfo.bannerMobile }}</h1>
    <h1>{{ brandInfo.tags }}</h1>
  </div>
</template>
