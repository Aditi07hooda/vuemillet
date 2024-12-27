<script setup>
const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref(null);
const sessionId = ref("");

const checkout = reactive({
  checkoutDetails: {},
  productImage: null,
  cartItems: [],
});

onMounted(async () => {
  if (typeof window !== "undefined") {
    sessionId.value = window.localStorage.getItem("sessionId");
    user.value = window.localStorage.getItem("user");
  }
  if (sessionId.value) {
    const { data, productImage } = await getCheckoutDetails(
      base_url,
      brand_id,
      sessionId.value
    );
    if (data) {
      console.log(data);
      checkout.checkoutDetails = data;
      checkout.productImage = productImage;
      checkout.cartItems = data.cart.items;
    }
  }
});
</script>
<template>
  <div>
    <h1>Checkout Details</h1>
    <p v-if="!checkout.checkoutDetails">Loading...</p>
    <div v-else class="flex lg:flex-row flex-col lg:px-16 lg:gap-10 gap-4 px-4">
      <div
        class="grid grid-flow-row lg:grid-cols-3 grid-cols-1 py-2 gap-3 md:w-8/12"
      >
        <div
          v-for="address in checkout.checkoutDetails.addressList"
          class="border p-4 rounded-lg bg-gray-50 shadow-md"
        >
          <p class="text-gray-700 font-bold capitalize">{{ address.person }}</p>
          <p
            class="text-gray-600 flex flex-wrap gap-2 align-middle font-semibold"
          >
            {{ address.mobile }}
          </p>
          <p class="text-gray-600">
            {{ address.door }}, {{ address.address }} {{ address.apartment }},
            {{ address.landmark }}
          </p>
          <p class="text-gray-600">
            {{ address.city }}, {{ address.state }}, {{ address.pinCode }}
          </p>
        </div>
      </div>
      <div class="md:w-1/3">
        <div class="">
          <p v-if="checkout.cartItems.length === 0">Your cart is empty.</p>
          <div
            v-for="(cartItem, index) in checkout.cartItems"
            :key="cartItem.id"
            class="flex-grow-0 flex px-4 py-2 border-gray-200 hover:bg-gray-100 justify-between"
          >
            <div class="relative flex items-start w-full">
              <div class="relative">
                <img
                  :src="checkout.productImage[index] || '/favicon.ico'"
                  alt="alt"
                  class="rounded-xl w-20 h-16"
                />
                <div
                  class="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2"
                >
                  {{ cartItem.qty }}
                </div>
              </div>
              <div class="ml-5">
                <p class="font-bold text-black text-base">
                  {{ cartItem.name }}
                </p>
                <p class="font-semibold text-gray-500 text-sm flex flex-wrap">
                  {{ cartItem.variantName }}
                </p>
              </div>
            </div>
            <p
              class="items-start flex font-semibold text-sm w-full justify-end text-green-950"
            >
              Rs. {{ cartItem.price * cartItem.qty }}
            </p>
          </div>
        </div>
        <div>
          <div>
            <div class="flex justify-between w-full border-b px-4 py-2">
              <p>Order Summary</p>
              <p>{{ checkout.cartItems.length || 0 }} items</p>
            </div>
            <div class="">
              <div class="flex justify-between w-full px-4 py-2">
                <p>Sub Total</p>
                <p>Rs. {{ checkout.checkoutDetails.orderValue || 0 }}</p>
              </div>
              <div class="flex justify-between w-full px-4 py-2">
                <p>Shipping Charges</p>
                <p>
                  Rs. {{ checkout.checkoutDetails.shippingCharges || 0 }}
                </p>
              </div>
              <div class="flex justify-between w-full px-4 py-2 border-t">
                <p>Total</p>
                <p>
                  Rs. {{ checkout.checkoutDetails.totalOrderValue || 0 }}
                </p>
              </div>
            </div>
            <div class="mx-5 my-3 flex gap-3">
              <UButton color="red" block>Checkout</UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
