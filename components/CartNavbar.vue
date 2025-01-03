<script setup>
import { ref, defineProps } from "vue";
import { useRuntimeConfig, useRoute, useFetch } from "#app";

defineProps({
  productPrice: {
    type: Number,
    required: false,
  },
  productImage: {
    type: String,
    required: false,
  },
  addToCart: {
    type: Function,
    required: false,
  },
  removeFromCart: {
    type: Function,
    required: false,
  },
});

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const route = useRoute();
const sessionId = ref(null);

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

const logOptionSize = (option) => {
  selectedSize.value = option;
  console.log("Selected size in cart navbar:", selectedSize.value);
};

watch(selectedSize, (newSize) => {
  logOptionSize(newSize);
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

console.log(product);
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
        <div class="flex flex-col">
          <label for="variantSelect">Size:</label>
          <select id="variantSelect" v-model="selectedSize">
            <option
              v-for="variant in product.variants"
              :key="variant"
              :value="variant"
            >
              {{ variant.name }}
            </option>
          </select>
        </div>
        <div class="border border-black flex gap-3 w-fit mt-2 h-fit">
          <p
            class="border-r border-black px-2 font-bold cursor-pointer"
            @click="increaseOrDecreaseQuantity(cartItem, false)"
          >
            -
          </p>
          <p>{{ selectedSize.moq }}</p>
          <p
            class="border-l border-black px-2 font-bold cursor-pointer"
            @click="increaseOrDecreaseQuantity(cartItem, true)"
          >
            +
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
