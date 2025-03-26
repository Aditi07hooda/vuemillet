<script setup>
import { ref, onMounted } from "vue";
import { fetchBrandInfo } from "../composables/session";

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
  <div class="relative w-full overflow-hidden bg-green-700 py-2">
    <div class="flex whitespace-nowrap animate-marquee">
      <div v-for="n in 5" :key="n" class="flex w-max flex-nowrap">
        <div
          v-for="(tag, index) in brandInfo.tags"
          :key="`${n}-${index}`"
          class="flex items-center"
        >
          <span class="text-lg font-semibold text-white text-center">
            {{ capitalize(tag.name) }}
          </span>
          <span class="inline-block" style="width: 2cm"></span>
          <span class="text-lg font-semibold text-white text-center"> * </span>
          <span class="inline-block" style="width: 2cm"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}
</style>
