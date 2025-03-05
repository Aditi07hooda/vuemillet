<script setup>
import { fetchCartItems, addToCart, removeFromCart } from "~/composables/cart";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const sessionId = ref("");

const page = ref(1);
const pageCount = 5;

const router = useRouter();

const navigateToCheckout = () => {
  router.push("/user/checkout");
};

const navigateToShopping = () => {
  router.push("/");
};

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
      await fetchCartData();
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
});

const fetchCartData = async () => {
  try {
    const { data, productImage } = await fetchCartItems(
      base_url,
      brand_id,
      sessionId.value
    );
    if (data && data.cart) {
      cartItems.cart = {
        items: data.cart.items || [],
        totalOrderValue: data.totalOrderValue || 0,
        discountAmt: data.discountAmt || 0,
        freeShipValue: data.freeShipValue || 0,
        inBlr: data.inBlr || false,
        minOrderValue: data.minOrderValue || 0,
        orderValAfterDiscount: data.orderValAfterDiscount || 0,
        orderValue: data.orderValue || 0,
        shippingCharges: data.shippingCharges || 0,
        walletAmt: data.walletAmt || 0,
        productImages: productImage || null,
      };
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

const increaseOrDecreaseQuantity = async (cartItem, incrementTask) => {
  try {
    if (incrementTask) {
      await addToCart(
        base_url,
        brand_id,
        sessionId.value,
        cartItem.variantId,
        cartItem.variantName
      );
    } else {
      await removeFromCart(
        base_url,
        brand_id,
        sessionId.value,
        cartItem.variantId,
        cartItem.variantName
      );
    }
    await fetchCartData();
  } catch (error) {
    console.error("Error updating cart quantity:", error);
  }
};

const rows = computed(() => {
  const start = (page.value - 1) * 5;
  const end = start + 5;
  return cartItems.cart.items.slice(start, end);
});

const columns = [
  {
    key: "name",
    label: "Product",
  },
  {
    key: "variantName",
    label: "Size",
  },
  {
    key: "qty",
    label: "Quantity",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "totalAmt",
    label: "Total",
  },
];
</script>

<template>
  <div v-if="user === null">
    <UserNotFound />
  </div>
  <div class="w-full px-8 my-10" v-else>
    <div class="md:flex md:flex-wrap md:justify-between md:gap-10 hidden">
      <div class="flex-1">
        <p v-if="cartItems.cart.items.length === 0">Your cart is empty.</p>
        <UTable
          v-if="cartItems.cart.items.length > 0"
          :rows="rows"
          :columns="columns"
          :loading="false"
          class="font-semibold"
          responsive
        >
          <template #name-data="{ row, index }">
            <div class="flex items-center">
              <ix-img
                v-if="
                  cartItems.cart.productImages &&
                  cartItems.cart.productImages[index]
                "
                :src="cartItems.cart.productImages[index]"
                alt="Product Image"
                class="w-16 h-16 object-cover mr-4"
                loading="lazy"
              />
              <span>{{ row.name }}</span>
            </div>
          </template>
          <template #qty-data="{ row }">
            <div class="flex items-center w-full">
              <button
                @click="increaseOrDecreaseQuantity(row, false)"
                class="px-2 py-1 bg-red-500 text-white rounded-md w-8"
              >
                -
              </button>
              <span class="mx-5">{{ row.qty }}</span>
              <button
                @click="increaseOrDecreaseQuantity(row, true)"
                class="px-2 py-1 bg-green-500 text-white rounded-md w-8"
              >
                +
              </button>
            </div>
          </template>
          <template #price-data="{ row }">
            <span class="">Rs. {{ row.price }}</span>
          </template>
          <template #totalAmt-data="{ row }">
            <span class="">Rs. {{ row.totalAmt }}</span>
          </template>
        </UTable>
        <div class="flex justify-between">
          <div class="mt-4">
            <button
              class="bg-green-700 text-white py-2 px-4 rounded-lg text-center text-md hover:bg-green-500"
              @click="navigateToShopping"
            >
              Continue Shopping
            </button>
          </div>
          <div class="mt-4 flex justify-end">
            <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="cartItems.cart.items.length"
              :class="{ hidden: cartItems.cart.items.length < 5 }"
            />
          </div>
        </div>
      </div>
      <div class="flex-shrink-0 w-80">
        <div class="bg-gray-100 p-4 rounded-md shadow-md">
          <p class="text-lg font-semibold">Order Summary</p>
          <div class="flex justify-between py-2">
            <span>Sub Total</span>
            <span>Rs. {{ cartItems.cart.orderValue || 0 }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span>Shipping Charges</span>
            <span>Rs. {{ cartItems.cart.shippingCharges || 0 }}</span>
          </div>
          <div class="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>Rs. {{ cartItems.cart.totalOrderValue || 0 }}</span>
          </div>
          <UButton class="mt-4" block color="red" @click="navigateToCheckout">
            Checkout
          </UButton>
        </div>
      </div>
    </div>
    <div class="md:hidden">
      <Cart :showDiv="false" />
    </div>
  </div>
</template>
