<script setup>
import Razorpay from "razorpay";
import {
  handleStartPayment,
  handlePaymentComplete,
  handlePaymentCancel,
} from "../composables/payment";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref(null);
const sessionId = ref("");
const discountInput = ref("");

const router = useRouter();

const checkout = reactive({
  checkoutDetails: {},
  productImage: null,
  cartItems: [],
  discountApplied: false,
  selectedAddress: null,
  order_id: "",
  orderStatus: null,
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

const applyingDiscount = async () => {
  if (discountInput.value) {
    const data = await applyDiscount(
      base_url,
      brand_id,
      sessionId.value,
      discountInput.value
    );
    if (data) {
      console.log("Discount applied successfully: ", data);
      checkout.discountApplied = true;
    }
  } else {
    alert("Please enter a discount");
  }
  discountInput.value = "";
};

const selectAddress = (address) => {
  checkout.selectedAddress = address;
};
const removeSelectedAddress = () => {
  checkout.selectedAddress = null;
};

const navigateToCart = () => {
  router.push("./cart");
};

const startPayment = async () => {
  try {
    if (!checkout.selectedAddress) {
      alert("Please select an address");
      return;
    }

    const data = await handleStartPayment(
      base_url,
      brand_id,
      sessionId.value,
      checkout.selectedAddress
    );

    console.log("Payment started successfully: ", data);

    const options = {
      key_id: data.key,
      ...data,
      handler: async (response) => {
        await handlePaymentComplete(
          base_url,
          brand_id,
          sessionId.value,
          response
        );
      },
      modal: {
        ondismiss: async () => {
          console.log("Payment window dismissed");
          await handlePaymentCancel(
            base_url,
            brand_id,
            sessionId.value,
            "Payment abandoned",
            data.order_id
          );
        },
      },
    };

    if (window.Razorpay) {
      const rzpay = new window.Razorpay(options);
      console.log("Payment window opened", rzpay);
      rzpay.open();
    } else {
      console.error("Razorpay is not defined");
    }

    rzpay.on("payment.failed", async (response) => {
      console.error("Payment failed:", response.error);
      await handlePaymentCancel(
        base_url,
        brand_id,
        sessionId.value,
        "Payment failed",
        response.error.metadata.order_id
      );
    });

    rzpay.on("payment.success", async (response) => {
      console.log("Payment successful:", response);
      checkout.orderStatus = response.status;
      checkout.order_id = response.orderId;

      const { data, productImage } = await getCheckoutDetails(
        base_url,
        brand_id,
        sessionId.value
      );
      if (data) {
        checkout.checkoutDetails = data;
        checkout.productImage = productImage;
        checkout.cartItems = data.cart.items;
      }
    });
  } catch (error) {
    console.error("Payment start failed: ", error);
    checkout.orderStatus = false;
  }
};
</script>
<template>
  <div v-if="user === null">
    <UserNotFound />
  </div>
  <div v-else>
    <div class="flex gap-3 md:px-16 py-2 px-4 items-center">
      <span
        class="text-red-500 font-medium text-sm cursor-pointer"
        @click="navigateToCart"
        >Cart
      </span>
      <span class="text-2xl">&#129170;</span>
      <span class="font-semibold text-sm">Information</span>
      <span class="text-2xl">&#129170;</span>
      <span class="text-gray-700 text-sm cursor-default">Payment</span>
    </div>
    <p v-if="!checkout.checkoutDetails">Loading...</p>
    <div v-else class="flex lg:flex-row flex-col lg:px-16 lg:gap-10 gap-4 px-4">
      <div class="md:w-[60%]">
        <div
          class="grid grid-flow-row lg:grid-cols-3 grid-cols-1 py-2 h-fit gap-3"
        >
          <div
            v-for="address in checkout.checkoutDetails.addressList"
            class="border p-4 rounded-lg bg-gray-50 shadow-md h-fit cursor-pointer"
            :class="{
              'border-green-500 lg:border-none border-2':
                checkout.selectedAddress === address,
            }"
            @click="selectAddress(address)"
          >
            <p class="text-gray-700 font-bold capitalize">
              {{ address.person }}
            </p>
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
        <div
          class="py-4 border-t-2 border-gray-100 bg-gray-50 rounded-md shadow-md px-4 hidden md:block"
          v-if="checkout.selectedAddress"
        >
          <div class="flex items-center space-x-3 mb-3">
            <span class="bg-gray-700 text-white p-2 rounded-full">
              <LucideMapPin />
            </span>
            <h3 class="text-lg font-bold text-gray-800">Shipping Address</h3>
          </div>
          <div class="mb-2">
            <p class="text-lg font-semibold text-gray-800">
              {{ checkout.selectedAddress.person }}
              <span class="text-sm text-gray-500"
                >({{ checkout.selectedAddress.mobile }})</span
              >
            </p>
          </div>
          <div class="text-gray-700 text-sm space-y-1">
            <p>
              <span class="font-semibold text-gray-600">Door/Apartment:</span>
              {{ checkout.selectedAddress.door }},
              {{ checkout.selectedAddress.apartment }}
            </p>
            <p>
              <span class="font-semibold text-gray-600">Address:</span>
              {{ checkout.selectedAddress.address }},
              {{ checkout.selectedAddress.city }},
              {{ checkout.selectedAddress.state }} -
              {{ checkout.selectedAddress.pinCode }}
            </p>
            <p>
              <span class="font-semibold text-gray-600">Landmark:</span>
              {{ checkout.selectedAddress.landmark || "N/A" }}
            </p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
            <button
              class="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 transition"
              @click="removeSelectedAddress"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div class="md:w-[40%] border-l bg-gray-100 py-3 h-fit">
        <div class="">
          <p v-if="checkout.cartItems.length === 0">Your cart is empty.</p>
          <div
            v-for="(cartItem, index) in checkout.cartItems"
            :key="cartItem.id"
            class="flex-grow-0 flex px-4 py-2 border-gray-200 hover:bg-gray-100"
          >
            <div class="relative flex items-start w-3/4">
              <div class="relative">
                <template v-if="checkout.productImage[index]">
                  <NuxtImg
                    provider="imgix"
                    :src="
                      checkout.productImage[index]?.startsWith('http')
                        ? checkout.productImage[index]?.replace(
                            /^https?:\/\//,
                            ''
                          )
                        : checkout.productImage[index]
                    "
                    alt="alt"
                    class="rounded-xl w-20 h-16"
                    loading="lazy"
                    sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
                  />
                </template>
                <template v-else>
                  <img
                    src="/favicon.ico"
                    alt="Millet Store Logo"
                    width="80"
                    height="64"
                    class="rounded-xl w-20 h-16 object-cover"
                    loading="lazy"
                  />
                </template>
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
              class="items-start flex font-semibold text-sm w-1/4 justify-end text-green-950"
            >
              Rs. {{ cartItem.price * cartItem.qty }}
            </p>
          </div>
        </div>
        <div class="h-fit">
          <div class="px-3 py-3">
            <div
              class="flex items-center border border-gray-300 rounded-md overflow-hidden"
            >
              <input
                type="text"
                placeholder="Apply Discount"
                class="flex-1 border-none outline-none bg-inherit pl-3"
                v-model="discountInput"
                :disabled="checkout.checkoutDetails.discountAmt > 0"
              />
              <button
                class="bg-gray-500 text-white px-4 py-2"
                @click="applyingDiscount"
              >
                Apply
              </button>
            </div>
          </div>
          <div>
            <div class="bg-green-700 mt-4">
              <div v-if="checkout.checkoutDetails.discountAmt > 0">
                <p class="flex items-center text-white text-sm py-2 px-4">
                  Discount applied!! You got discount of Rs.
                  {{ checkout.checkoutDetails.discountAmt }}
                </p>
              </div>
            </div>
            <div class="bg-red-700 mt-4">
              <div
                v-if="
                  checkout.checkoutDetails.discountAmt === 0 &&
                  checkout.discountApplied
                "
              >
                <p class="flex items-center text-white text-sm py-2 px-4">
                  Sorry, no discount applied. Please try again.
                </p>
              </div>
            </div>
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
                <p>Rs. {{ checkout.checkoutDetails.shippingCharges || 0 }}</p>
              </div>
              <div class="flex justify-between w-full px-4 py-2">
                <p>Discount</p>
                <p>Rs. {{ checkout.checkoutDetails.discountAmt || 0 }}</p>
              </div>
              <div class="flex justify-between w-full px-4 py-2 border-t">
                <p>Total</p>
                <p>Rs. {{ checkout.checkoutDetails.totalOrderValue || 0 }}</p>
              </div>
            </div>
            <div class="mx-5 my-3 flex gap-3">
              <button
                class="bg-green-700 text-white py-2 px-4 w-full rounded-lg text-center text-md hover:bg-green-500"
                @click="startPayment"
              >
                Continue Payment
              </button>
            </div>
            <!-- <div class="flex gap-3 my-3" v-if="!checkout.orderStatus">
              <p>Payment is cancelled or failed.</p>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
