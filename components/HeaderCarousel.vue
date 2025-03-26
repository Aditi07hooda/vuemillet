<script setup>
import { fetchBrandInfo } from "../composables/session";
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const sessionId = ref(null);
const collectionCarouselRef = ref();

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const brandInfo = ref({
  bannerWeb: [],
  bannerMobile: [],
});

onMounted(async () => {
  const data = await fetchBrandInfo(baseURL, brandID);
  console.log(data);
  brandInfo.value.bannerWeb = data.brand.banners;
  brandInfo.value.bannerMobile = data.brand.bannersForMobile;
});

onMounted(() => {
  setInterval(() => {
    if (!collectionCarouselRef.value) return;
    if (
      collectionCarouselRef.value.page === collectionCarouselRef.value.pages
    ) {
      collectionCarouselRef.value.select(0);
    }
    collectionCarouselRef.value.next();
  }, 3000);
});
</script>
<template>
  <div class="">
    <UCarousel
      v-slot="{ item }"
      :items="brandInfo.bannerWeb"
      :ui="{ item: 'basis-full' }"
      class="rounded-lg overflow-hidden hidden md:block"
      indicators
      ref="collectionCarouselRef"
    >
      <NuxtImg
        provider="imgix"
        :src="
          item.name.startsWith('http')
            ? item.name.replace(/^https?:\/\//, '')
            : item.name
        "
        class="w-full h-screen"
        draggable="false"
        format="webp"
        loading="lazy"
        sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
      />
    </UCarousel>

    <UCarousel
      v-slot="{ item }"
      :items="brandInfo.bannerMobile"
      :ui="{ item: 'basis-full h-fit' }"
      class="rounded-lg overflow-hidden md:hidden"
      indicators
      ref="collectionCarouselRef"
    >
      <NuxtImg
        provider="imgix"
        :src="
          item.name.startsWith('http')
            ? item.name.replace(/^https?:\/\//, '')
            : item.name
        "
        class="w-full h-1/2 bg-cover"
        draggable="false"
        loading="lazy"
        format="webp"
        sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
      />
    </UCarousel>
  </div>
</template>
