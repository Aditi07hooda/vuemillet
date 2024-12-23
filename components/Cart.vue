<script setup>
import { fetchCartItems } from "~/composables/cart";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const sessionId = ref("");

const cartItems = reactive({
    cart : []
})

onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      sessionId.value = window.localStorage.getItem("sessionId");
      user.value = window.localStorage.getItem("user");
    }
    if (sessionId.value) {
      const data = await fetchCartItems(base_url, brand_id, sessionId.value);
      console.log("Cart items:", data);
      cartItems.cart = data;
    }
  } catch (error) {
    console.error("Error fetching cart items in cart vue:", error);
  }
});
</script>

<template>
    <div class="w-full">
        <div>
            Continue Shopping...
        </div>
        <hr class="my-2"/>
        <div>
            <div class="flex justify-between">
                <div class="flex flex-wrap w-fit">
                    {{ cartItems.cart.cart?.items[0]?.name }}
                </div>
                <div>
                    {{ cartItems.cart.totalOrderValue }}
                </div>
            </div>
        </div>
    </div>
</template>
