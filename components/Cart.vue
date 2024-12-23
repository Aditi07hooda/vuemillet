<script setup>
import { fetchCartItems } from "~/composables/cart";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const sessionId = ref("");

onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      sessionId.value = window.localStorage.getItem("sessionId");
      user.value = window.localStorage.getItem("user");
    }
    if (sessionId.value) {
      const data = await fetchCartItems(base_url, brand_id, sessionId.value);
      console.log("Cart items:", data);
    }
  } catch (error) {
    console.error("Error fetching cart items in cart vue:", error);
  }
});
</script>

<template>This is cart component</template>
