<script setup>
import { fetchCartItems } from "~/composables/cart";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const sessionId = ref("");

const cartItems = reactive({
  cart: {
    items: [],
    totalOrderValue: 0,
    discountAmt: 0,
    freeShipValue: 0,
    inBlr: false,
    minOrderValue: 0,
    orderValAfterDiscount: 0,
    orderValue: 0,
    shippingCharges: 0,
    walletAmt: 0,
  },
});

onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      sessionId.value = window.localStorage.getItem("sessionId");
      user.value = window.localStorage.getItem("user");
    }
    if (sessionId.value) {
      const data = await fetchCartItems(base_url, brand_id, sessionId.value);
      console.log("Fetched cart items:", data);
      if (data && data.cart) {
        cartItems.cart = {
          items: data.cart.items || [],
          totalOrderValue: data.totalOrderValue || 0,
          discountAmt: data.discountAmt || 0,
          freeShipValue: data.freeShipValue || 0,
          inBlr: data.inBlr || false,
          minOrderValue: data.minOrderValue || 0,
          orderValAfterDiscount: data.orderValAfterDiscount || 0,
        };
      } else {
        console.error("Cart data is missing or malformed:", data);
      }
    }
  } catch (error) {
    console.error("Error fetching cart items in Cart.vue:", error);
  }

  console.log("Cart items:", cartItems.cart);
});
</script>

<template>
  <div class="w-full">
    <div>Continue Shopping...</div>
    <hr class="my-2" />
    <div>
      <div class="flex justify-between">
        <div class="flex flex-wrap w-fit">
          <p v-if="cartItems.cart.items.length === 0">Your cart is empty.</p>
          <div v-for="cartItem in cartItems.cart.items" :key="cartItem.id">
            <p>{{ cartItem.name }}</p>
            <p>Quantity: {{ cartItem.qty }}</p>
            <p>Size: {{ cartItem.variantName }}</p>
            <p>Price: Rs. {{ cartItem.price }}</p>
          </div>
        </div>
        <div>
          <p>Total: {{ cartItems.cart.totalOrderValue || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
