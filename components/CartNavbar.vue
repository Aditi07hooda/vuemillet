<script setup>
import { ref, defineProps, watch, onMounted, reactive, computed } from "vue";
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
const selectedVariants = reactive({});

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

// Initialize selectedVariants with the first option for each variant type
watchEffect(() => {
  if (product.value) {
    product.value.variantTypes.forEach((variantType) => {
      selectedVariants[variantType] = product.value.variantMatrix[variantType][0];
    });
  }
});

// Find the selected variant object based on the selected variants
const selectedVariant = computed(() => {
  return product.value?.variants.find((variant) =>
    product.value.variantTypes.every(
      (variantType) =>
        variant.matrix[variantType] === selectedVariants[variantType]
    )
  );
});

const fetchingCartItems = async () => {
  const { data } = await fetchCartItems(baseURL, brandID, sessionId.value);
  if (data && data.cart) {
    const x = data.cart.items.find(
      (item) => item.variantId === selectedVariant.value?.id
    );
    console.log("Fetched cart items:", x);
    selectedItemInCart.value = x?.qty || 0;
  }
};

onMounted(async () => {
  await fetchingCartItems();
});

const logOptionVariant = async (variantType, selectedOption) => {
  selectedVariants[variantType] = selectedOption;
  await fetchingCartItems();
};

watch(selectedVariants, async () => {
  await fetchingCartItems();
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const increaseOrDecreaseQuantity = async (incrementTask) => {
  try {
    if (!selectedVariant.value) {
      console.error("Selected variant not found");
      return;
    }

    let data = null;
    if (incrementTask) {
      data = await addToCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedVariant.value.id,
        selectedVariant.value.name
      );
      cartModelVisible.openCartModel();
    } else {
      data = await removeFromCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedVariant.value.id,
        selectedVariant.value.name
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
</script>

<template>
  <div class="fixed top-0 w-full ease-in-out duration-300">
    <div class="flex w-full px-20 py-5 bg-orange-100 justify-between">
      <div class="flex justify-between gap-8">
        <img :src="mainImg" alt="Product image" class="h-12 w-12" />
        <div class="">
          <h2 class="text-base">
            {{ capitalize(product?.name || product?.webName) }}
          </h2>
          <p>Rs. {{ selectedVariant?.offerPrice }}</p>
        </div>
      </div>
      <div class="flex justify-between w-[30%]">
        <div class="flex flex-row items-center justify-center gap-2">
          <div v-for="variantType in product?.variantTypes" :key="variantType">
            <label :for="variantType">{{ capitalize(variantType) }}:</label>
            <USelectMenu
              v-model="selectedVariants[variantType]"
              :options="product.variantMatrix[variantType]"
              :placeholder="`Select ${variantType}`"
              option-attribute="name"
              @update:model-value="logOptionVariant(variantType, $event)"
            />
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-center"
          v-if="selectedItemInCart === 0"
        >
          <button
            @click="increaseOrDecreaseQuantity(true)"
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
            @click="increaseOrDecreaseQuantity(false)"
          >
            −
          </p>
          <p class="px-2 py-1 text-base font-semibold">
            {{ selectedItemInCart }}
          </p>
          <p
            class="px-2 py-1 font-bold text-base cursor-pointer border-l border-gray-700 hover:bg-gray-200 transition"
            @click="increaseOrDecreaseQuantity(true)"
          >
            +
          </p>
        </div>
      </div>
    </div>
  </div>
</template>