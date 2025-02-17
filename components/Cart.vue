<script setup>
import { fetchCartItems, addToCart } from "~/composables/cart";
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const sessionId = ref("");

const productId = ref("");

defineProps({
  showDiv: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();

const navigateToCheckout = () => {
  router.push("/user/checkout");
  cartModelVisible.closeCartModel();
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
      await fetchCart();
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
          orderValue: data.orderValue || 0,
          shippingCharges: data.shippingCharges || 0,
          walletAmt: data.walletAmt || 0,
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

const fetchCart = async () => {
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
      orderValue: data.orderValue || 0,
      shippingCharges: data.shippingCharges || 0,
      walletAmt: data.walletAmt || 0,
      productImages: productImage || null,
    };
  } else {
    console.error("Cart data is missing or malformed:", data);
  }
};

const deleteCartItem = async (cartItem) => {
  try {
    console.log("cart item to be deleted ", cartItem);
    const data = await emptyCart(base_url, brand_id, sessionId.value, cartItem);
    if (data) {
      await fetchCart();
    }
  } catch (error) {
    console.error("error emptying the cart");
  }
};

const getProduct = async (cartItem) => {
  const data = await getProductId(
    base_url,
    brand_id,
    sessionId.value,
    cartItem.variantId,
    cartItem.variantName
  );
  if (data) {
    productId.value = data;
  }
  router.push(`/product/${productId.value}`);
  cartModelVisible.closeCartModel();
};
</script>

<template>
  <div class="w-full h-full">
    <div
      class="flex flex-row justify-between py-3 px-4 items-center align-middle border-b"
      v-if="showDiv"
    >
      <div
        @click="cartModelVisible.closeCartModel()"
        class="flex gap-2 cursor-pointer"
      >
        <LucideChevronLeft class="w-4 h-4" />
        <p class="text-sm font-serif">Continue Shopping</p>
      </div>
    </div>
    <div class="flex flex-col justify-between w-full">
      <div class="flex flex-col overflow-y-scroll max-h-[350px] h-[330px] md:max-h-[450px] md:h-[400px]">
        <p v-if="cartItems.cart.items.length === 0" class="pl-3">
          Your cart is empty.
        </p>
        <div
          v-for="(cartItem, index) in cartItems.cart.items"
          :key="cartItem.variantId"
          class="flex-grow-0 flex w-full px-4 py-2 border-b border-gray-200 hover:bg-gray-100"
        >
          <div class="flex items-center w-3/4">
            <img
              :src="cartItems.cart.productImages[index] || '/favicon.ico'"
              alt="alt"
              class="rounded-xl w-20 h-16 cursor-pointer"
              @click="getProduct(cartItem)"
            />
            <div class="ml-3 w-full">
              <div class="cursor-pointer" @click="getProduct(cartItem)">
                <p class="font-bold text-black text-base w-full">
                  {{ cartItem.name }}
                </p>
                <p class="font-semibold text-gray-500 text-sm flex flex-wrap">
                  {{ cartItem.variantName }}
                </p>
              </div>
              <div class="border flex gap-3 w-fit mt-2">
                <p
                  class="border-r px-2 font-bold cursor-pointer"
                  @click="increaseOrDecreaseQuantity(cartItem, false)"
                >
                  -
                </p>
                <p>{{ cartItem.qty }}</p>
                <p
                  class="border-l px-2 font-bold cursor-pointer"
                  @click="increaseOrDecreaseQuantity(cartItem, true)"
                >
                  +
                </p>
              </div>
            </div>
          </div>
          <div class="w-1/4 justify-end flex flex-col">
            <p
              class="items-end flex font-bold text-base w-full justify-end text-green-600"
            >
              Rs. {{ cartItem.price * cartItem.qty }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <div
          class="bg-green-700"
          v-if="cartItems.cart.freeShipValue > cartItems.cart.orderValue"
        >
          <p class="flex items-center text-white text-sm py-2 px-4">
            Add worth Rs.
            {{ cartItems.cart.freeShipValue - cartItems.cart.orderValue }}
            items to have free shipping
          </p>
        </div>
        <div class="w-full">
          <div class="flex justify-between w-full border-b px-4 py-2">
            <p>Order Summary</p>
            <p>{{ cartItems.cart.items.length || 0 }} items</p>
          </div>
          <div class="flex justify-between w-full px-4 py-2">
            <p>Sub Total</p>
            <p>Rs. {{ cartItems.cart.orderValue || 0 }}</p>
          </div>
          <div class="flex justify-between w-full px-4 py-2">
            <p>Shipping Charges</p>
            <p>Rs. {{ cartItems.cart.shippingCharges || 0 }}</p>
          </div>
          <div class="flex justify-between w-full px-4 py-2 border-t">
            <p>Total</p>
            <p>Rs. {{ cartItems.cart.totalOrderValue || 0 }}</p>
          </div>
          <div class="mx-5 my-3 flex gap-3">
            <button
              @click="navigateToCheckout"
              class="bg-pink-600 text-white font-bold hover:bg-green-400 transition duration-500 w-full py-2 rounded cursor-pointer"
              :disabled="cartItems.cart.items.length === 0"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
