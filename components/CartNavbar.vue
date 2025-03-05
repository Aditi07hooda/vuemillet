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

const productId = await findProductId(
  baseURL,
  brandID,
  sessionId.value,
  route.params.slug
);

const {
  data: product,
  error,
  loading,
} = await useFetch(`${baseURL}/store/${brandID}/products/${productId}`);

const mainImg = ref(
  product.value?.oneImg || product.value?.images[0] || "/favicon.ico"
);

// Initialize selectedVariants with the first option for each variant type
watchEffect(() => {
  if (product.value) {
    product.value.variantTypes.forEach((variantType) => {
      selectedVariants[variantType] =
        product.value.variantMatrix[variantType][0];
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
  <div
    class="w-full bg-white shadow-md ease-in-out duration-300 bottom-0 fixed h-fit md:top-0 border-t md:border-b border-gray-200"
  >
    <div
      class="flex flex-col md:flex-row w-full px-10 py-4 bg-orange-50 justify-between items-center border-b border-gray-200"
    >
      <div class="flex items-center gap-6">
        <ix-img
          :src="mainImg"
          alt="Product image"
          class="md:h-16 md:w-16 h-10 w-10 rounded-lg shadow-md object-cover"
          loading="lazy"
        />
        <div>
          <h2 class="md:text-lg text-base font-semibold text-gray-800">
            {{ capitalize(product?.name || product?.webName) }}
          </h2>
          <p class="text-sm text-gray-600 font-medium">
            Rs. {{ selectedVariant?.offerPrice }}
          </p>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-6 md:w-[35%] justify-end mt-2 md:mt-0"
      >
        <div class="flex items-center gap-4">
          <div
            v-for="variantType in product?.variantTypes"
            :key="variantType"
            class="flex flex-row items-center md:flex-col"
          >
            <label :for="variantType" class="text-sm font-medium text-gray-700"
              >{{ capitalize(variantType) }}:</label
            >
            <USelectMenu
              v-model="selectedVariants[variantType]"
              :options="product.variantMatrix[variantType]"
              :placeholder="`Select ${variantType}`"
              option-attribute="name"
              @update:model-value="logOptionVariant(variantType, $event)"
              class="rounded-md px-2 md:px-3 py-1 text-gray-700 focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div
          v-if="selectedItemInCart === 0"
          class="flex items-center w-full md:w-fit"
        >
          <button
            @click="increaseOrDecreaseQuantity(true)"
            class="bg-pink-500 text-white text-base md:text-lg md:font-semibold font-normal w-full hover:bg-pink-600 transition duration-300 md:px-5 md:py-2 px-2 py-1 rounded-full shadow-md"
          >
            Add to cart
          </button>
        </div>

        <div
          v-else
          class="flex items-center gap-2 border border-gray-300 rounded-lg bg-white shadow-sm"
        >
          <button
            @click="increaseOrDecreaseQuantity(false)"
            class="md:px-3 px-2 py-1 md:py-2 font-bold md:text-lg text-base text-gray-700 border-r border-gray-300 hover:bg-gray-200 transition"
          >
            −
          </button>
          <p
            class="md:px-4 px-2 py-1 md:py-2 md:text-lg text-base font-semibold text-gray-800"
          >
            {{ selectedItemInCart }}
          </p>
          <button
            @click="increaseOrDecreaseQuantity(true)"
            class="md:px-3 px-2 py-1 md:py-2 font-bold md:text-lg text-base text-gray-700 border-l border-gray-300 hover:bg-gray-200 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
