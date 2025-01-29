<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import { useRuntimeConfig, useRoute, useFetch } from "#app";
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

defineProps({
  productPrice: { type: Number, required: false },
  productImage: { type: String, required: false },
  addToCart: { type: Function, required: false },
  removeFromCart: { type: Function, required: false },
});

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const route = useRoute();

const sessionId = ref(null);
const selectedItemInCart = ref(0);
const selectedSizeOption = ref();

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const {
  data: product,
  error,
  loading,
} = await useFetch(`${baseURL}/store/${brandID}/products/${route.params.slug}`);

const mainImg = ref(
  product.value?.oneImg || product.value?.images[0] || "/favicon.ico"
);

const selectedSize = ref(
  containsOnlySize(product.value?.variantTypes)
    ? product.value?.variants?.[0]
    : product.value?.variantMatrix?.Size?.[0] ||
        product.value?.variantMatrix?.size?.[0] ||
        product.value?.variantMatrix?.SIZE?.[0]
);

const fetchingCartItems = async () => {
  const { data, productImage } = await fetchCartItems(
    baseURL,
    brandID,
    sessionId.value
  );
  if (data && data.cart) {
    const x = data.cart.items.find(
      (item) => item.variantId === selectedSize.value.id
    );
    console.log("Fetched cart items:", x);
    selectedItemInCart.value = x?.qty || 0;
  }
};

onMounted(async () => {
  await fetchingCartItems();
});

const logOptionSize = async () => {
  selectedSize.value = selectedSizeOption.value;
  //   console.log("Selected size in cart navbar:", selectedSize.value);
  await fetchingCartItems();
  //   console.log("Fetched cart items after selecting size:", selectedItemInCart.value);
};

watch(selectedSize, async (newSize) => {
  await logOptionSize(newSize);
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const increaseOrDecreaseQuantity = async (selectedSize, incrementTask) => {
  try {
    console.log("Selected size:", selectedSize);
    let data = null;
    if (incrementTask) {
      data = await addToCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedSize.id,
        selectedSize.name
      );
      cartModelVisible.openCartModel();
    } else {
      data = await removeFromCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedSize.id,
        selectedSize.name
      );
      cartModelVisible.openCartModel();
    }
    if (data) {
      await fetchingCartItems();
    } else {
      console.error("Cart data is missing or malformed:", data);
    }
  } catch (error) {
    console.error("Error increasing quantity in Cart.vue:", error);
  }
};

watchEffect(() => {
  if (product.value) {
    selectedSizeOption.value = product.value.variants[0].name;
  }
});

console.log("selected size product " + selectedSize.value);
</script>

<template>
  <div class="fixed top-0 w-full ease-in-out duration-300">
    <div class="flex w-full px-20 py-5 bg-orange-100 justify-between">
      <div class="flex justify-between gap-8">
        <img :src="mainImg" alt="Product image" class="h-12 w-12" />
        <div class="">
          <h2 class="text-base">
            {{ capitalize(product.name || product.webName) }}
          </h2>
          <p>Rs. {{ selectedSize.offerPrice }}</p>
        </div>
      </div>
      <div class="flex justify-between w-1/4">
        <div class="flex flex-row items-center justify-center gap-2">
          <label for="variantSelect">Size:</label>
          <USelectMenu
            v-model="selectedSizeOption"
            :options="product.variants"
            placeholder="Select size"
            option-attribute="name"
            @update:model-value="logOptionSize"
          />
        </div>
        <div
          class="flex flex-row items-center justify-center"
          v-if="selectedItemInCart === 0"
        >
          <button
            @click="increaseOrDecreaseQuantity(selectedSize, true)"
            class="bg-pink-400 text-white hover:bg-green-400 transition duration-500 w-fit text-base h-fit px-4 py-1 rounded-3xl"
          >
            Add to cart
          </button>
        </div>
        <div
          class="flex items-center gap-4 w-fit h-fit mt-2 border border-gray-700 rounded-lg overflow-hidden bg-white"
          v-else
        >
          <p
            class="px-2 py-1 font-bold text-base cursor-pointer border-r border-gray-700 hover:bg-gray-200 transition"
            @click="increaseOrDecreaseQuantity(selectedSize, false)"
          >
            −
          </p>
          <p class="px-2 py-1 text-base font-semibold">
            {{ selectedItemInCart }}
          </p>
          <p
            class="px-2 py-1 font-bold text-base cursor-pointer border-l border-gray-700 hover:bg-gray-200 transition"
            @click="increaseOrDecreaseQuantity(selectedSize, true)"
          >
            +
          </p>
        </div>
      </div>
    </div>
  </div>
</template>