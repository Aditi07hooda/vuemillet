<script setup>
const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref(null);
const sessionId = ref("");

const checkout = reactive({
  checkoutDetails: {},
});

onMounted(async () => {
  if (typeof window !== "undefined") {
    sessionId.value = window.localStorage.getItem("sessionId");
    user.value = window.localStorage.getItem("user");
  }
  if (sessionId.value) {
    const data = await getCheckoutDetails(base_url, brand_id, sessionId.value);
    if (data) {
      console.log(data);
      checkout.checkoutDetails = data;
    }
  }
});
</script>
<template>
  <div>
    <h1>Checkout Details</h1>
    <p v-if="!checkout.checkoutDetails">Loading...</p>
    <div v-else>
      <div class="grid grid-flow-row lg:grid-cols-3 grid-cols-1 py-2 px-4 gap-3">
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
      
    </div>
  </div>
</template>
