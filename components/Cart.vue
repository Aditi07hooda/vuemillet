<script setup>
import { fetchCartItems, addToCart } from "~/composables/cart";
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

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
    productImages: null,
  },
});

onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      sessionId.value = window.localStorage.getItem("sessionId");
      user.value = window.localStorage.getItem("user");
    }
    if (sessionId.value) {
      const { data, productImage } = await fetchCartItems(
        base_url,
        brand_id,
        sessionId.value
      );
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
          productImages: productImage || null,
        };
      } else {
        console.error("Cart data is missing or malformed:", data);
      }
    }
  } catch (error) {
    console.error("Error fetching cart items in Cart.vue:", error);
  }
});

const increaseOrDecreaseQuantity = async (cartItem, incrementTask) => {
  try {
    let data = null;
    if (incrementTask) {
      data = await addToCart(
        base_url,
        brand_id,
        sessionId.value,
        cartItem.variantId,
        cartItem.variantName
      );
    } else {
      data = await removeFromCart(
        base_url,
        brand_id,
        sessionId.value,
        cartItem.variantId,
        cartItem.variantName
      );
    }
    if (data) {
      const { data, productImage } = await fetchCartItems(
        base_url,
        brand_id,
        sessionId.value
      );
      console.log("Fetched cart items in increaseOrDecrease:", data);
      if (data && data.cart) {
        cartItems.cart = {
          items: data.cart.items || [],
          totalOrderValue: data.totalOrderValue || 0,
          discountAmt: data.discountAmt || 0,
          freeShipValue: data.freeShipValue || 0,
          inBlr: data.inBlr || false,
          minOrderValue: data.minOrderValue || 0,
          orderValAfterDiscount: data.orderValAfterDiscount || 0,
          productImages: productImage || null,
        };
      } else {
        console.error("Cart data is missing or malformed:", data);
      }
    }
  } catch (error) {
    console.error("Error increasing quantity in Cart.vue:", error);
  }
};
</script>

<template>
  <div class="w-full">
    <div @click="cartModelVisible.closeCartModel()">Continue Shopping...</div>
    <hr class="my-2" />
    <div>
      <div class="flex flex-col justify-between">
        <div class="flex flex-col flex-wrap w-full">
          <p v-if="cartItems.cart.items.length === 0">Your cart is empty.</p>
          <div
            v-for="(cartItem, index) in cartItems.cart.items"
            :key="cartItem.id"
            class="flex-grow-0 flex w-full md:w-auto px-4 py-2 border-b border-gray-200 hover:bg-gray-100 justify-between"
          >
            <div class="flex items-center w-full">
              <img
                :src="cartItems.cart.productImages[index] || '/favicon.ico'"
                alt="alt"
                class="rounded-xl w-12 h-12"
              />
              <div class="ml-3">
                <p class="font-bold text-black text-base">
                  {{ cartItem.name }}
                </p>
                <p class="font-semibold text-gray-500 text-sm flex flex-wrap">
                  {{ cartItem.variantName }}
                </p>
                <div class="border flex gap-3 w-fit mt-2">
                  <p class="border-r px-2 font-bold" @click="increaseOrDecreaseQuantity(cartItem, false)">-</p>
                  <p>{{ cartItem.qty }}</p>
                  <p
                    class="border-l px-2 font-bold"
                    @click="increaseOrDecreaseQuantity(cartItem, true)"
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <p
              class="items-end flex font-semibold text-sm w-full justify-end text-green-950"
            >
              Rs. {{ cartItem.price }}
            </p>
          </div>
        </div>
        <div>
          <p>Total: {{ cartItems.cart.totalOrderValue || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
