<script setup>
import MADE_TO_ORDER from "@/assets/images/MADE_TO_ORDER.PNG";
import NO_PRESERVATIVES from "@/assets/images/NO_PRESERVATIVES.PNG";
import ORGANIC from "@/assets/images/ORGANIC.PNG";
import JAGGERY from "@/assets/images/JAGGERY.PNG";
import MILLETS from "@/assets/images/MILLETS.PNG";
import { calculateDiscount } from "../../composables/discount";
import { capitalize } from "../../composables/capitalize";
import { containsOnlySize } from "../../composables/containsOnlySize";

import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const route = useRoute();
const {
  data: product,
  error,
  loading,
} = await useFetch(`${baseURL}/store/${brandID}/products/${route.params.slug}`);

const mainImg = ref(
  product.value.oneImg || product.value.images[0] || "/favicon.ico"
);

const changeMainImage = (src) => {
  mainImg.value = src;
};

const getSrcFromTags = (tag) => {
  switch (tag.toLowerCase()) {
    case "made_to_order":
      return MADE_TO_ORDER;
    case "no_preservatives":
      return NO_PRESERVATIVES;
    case "organic":
      return ORGANIC;
    case "jaggery":
      return JAGGERY;
    case "millets":
      return MILLETS;
    default:
      return null;
  }
};

const selectedSize = ref(
  containsOnlySize(product.value.variantTypes)
    ? product.value.variants?.[0]
    : product.value.variantMatrix?.Size?.[0] ||
        product.value.variantMatrix?.size?.[0] ||
        product.value.variantMatrix?.SIZE?.[0]
);

const selectedVariant = ref(
  product.value.variantMatrix?.Millet?.[0] ||
    product.value.variantMatrix?.Variant?.[0] ||
    product.value.variantMatrix?.flavour?.[0] ||
    product.value.variantMatrix?.Texture?.[0] ||
    product.value.variantMatrix?.texture?.[0] ||
    product.value.variantMatrix?.Sweetner?.[0] ||
    product.value.variantMatrix?.Packing?.[0] ||
    product.value.variantMatrix?.packing?.[0] ||
    product.value.variantMatrix?.package?.[0] ||
    product.value.variantMatrix?.Package?.[0] ||
    product.value.variantMatrix?.Pack?.[0]
);

const selectedOption = computed(() => {
  return product.value.variants.find(
    (x) =>
      (x.matrix.Millet === selectedVariant.value ||
        x.matrix.Texture === selectedVariant.value ||
        x.matrix.texture === selectedVariant.value ||
        x.matrix.Sweetner === selectedVariant.value ||
        x.matrix.Packing === selectedVariant.value ||
        x.matrix.packing === selectedVariant.value ||
        x.matrix.package === selectedVariant.value ||
        x.matrix.Package === selectedVariant.value ||
        x.matrix.Pack === selectedVariant.value ||
        x.matrix.Variant === selectedVariant.value) &&
      (x.matrix.Size === selectedSize.value ||
        x.matrix.size === selectedSize.value ||
        x.matrix.SIZE === selectedSize.value)
  );
});

const logOptionSize = (option) => {
  selectedSize.value = option;
  console.log("Selected size:", selectedSize.value);
};

const logOptionVariant = (option) => {
  selectedVariant.value = option;
  console.log("Selected variant:", selectedVariant.value);
};

// This is needed because sometimes the printDescription only contains tags but not text content inside
const hasContent = computed(() => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = product.value.printDescription;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  return textContent.trim().length > 0;
});

console.log("data of each product", product.value);

const addingToCart = async () => {
  const sessionId = localStorage.getItem("sessionId");
  const data = await addToCart(
    baseURL,
    brandID,
    sessionId,
    selectedSize.value.id,
    selectedSize.value.name
  );
  console.log("Added to cart", data);
  cartModelVisible.openCartModel();
};
</script>
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div
      class="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md p-6 gap-6 max-w-6xl mx-auto my-4"
    >
      <div class="w-full md:w-1/2 flex flex-col md:flex-row">
        <div class="w-full">
          <img
            :src="mainImg"
            alt="Product Image"
            class="w-full h-auto rounded-lg object-cover shadow"
          />
        </div>
        <div
          v-if="product.images.length > 1"
          class="flex flex-row mt-4 md:flex-col md:mt-0 md:ml-4 md:justify-end"
        >
          <div
            v-for="image in product.images"
            :key="image"
            class="mr-2 md:mb-2 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow rounded-lg"
          >
            <img
              :src="image"
              :alt="image"
              width="100"
              class="rounded-lg md:mr-0 mb-0"
              @click="changeMainImage(image)"
            />
          </div>
        </div>
      </div>
      <div
        class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
      >
        <h2
          class="custom-underline text-2xl font-semibold text-gray-800 mb-2 text-center"
        >
          {{ capitalize(product.name || product.webName) }}
        </h2>
        <div class="flex justify-evenly mb-4 items-start">
          <div
            v-for="tag in product.tags"
            :key="tag"
            class="text-gray-800 flex flex-col justify-center flex-1"
          >
            <div class="flex justify-center items-center">
              <img :src="getSrcFromTags(tag)" :alt="tag" width="70px" />
            </div>
            <div class="text-center">
              {{ capitalize(tag) === "Jaggery" ? "No Sugar" : capitalize(tag) }}
            </div>
          </div>
        </div>
        <div
          v-if="containsOnlySize(product.variantTypes)"
          class="text-gray-800"
        >
          <div class="flex">
            <div
              class="mb-2 variant-label font-semibold flex items-center justify-center"
            >
              Size
            </div>
            <div class="flex flex-wrap">
              <div
                v-for="option in product.variants"
                :key="option"
                @click="logOptionSize(option)"
                class="rounded-full px-2 mx-2 mb-2 p-2 options cursor-pointer"
                :class="selectedSize === option ? 'selected' : ''"
              >
                {{ option.name }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-800">
          <div class="flex mb-2">
            <div
              class="mb-2 w-2/12 variant-label font-semibold flex items-center"
            >
              {{ capitalize(product?.variantTypes[0]) }}
            </div>
            <div class="flex flex-wrap w-10/12">
              <div
                v-for="option in product.variantMatrix[product.variantTypes[0]]"
                :key="option"
                @click="logOptionSize(option)"
                class="rounded-full p-2 mx-2 mb-2 options transition duration-500 cursor-pointer"
                :class="selectedSize === option ? 'selected' : ''"
              >
                {{ option }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div
              class="mb-2 w-2/12 variant-label font-semibold flex items-center"
            >
              {{ capitalize(product.variantTypes[1]) }}
            </div>
            <div class="flex flex-wrap w-10/12">
              <div
                v-for="option in product.variantMatrix[product.variantTypes[1]]"
                :key="option"
                @click="logOptionVariant(option)"
                class="rounded-full p-2 mx-2 mb-2 options transition duration-500 cursor-pointer"
                :class="selectedVariant === option ? 'selected' : ''"
              >
                {{ capitalize(option) }}
              </div>
            </div>
          </div>
        </div>
        <div class="font-bold my-2 text-center">
          <div v-if="containsOnlySize(product.variantTypes)">
            <div class="text-rose-600">
              {{
                calculateDiscount(selectedSize.price, selectedSize.offerPrice)
              }}
              % off
            </div>
            <span class="line-through text-black"
              >₹ {{ selectedSize.price }}</span
            >
            <span class="text-green-600"> ₹ {{ selectedSize.offerPrice }}</span>
          </div>
          <div v-else>
            <div class="text-rose-600">
              {{
                calculateDiscount(
                  selectedOption.price,
                  selectedOption.offerPrice
                )
              }}
              % off
            </div>
            <span class="line-through text-black"
              >₹ {{ selectedOption.price }}</span
            >
            <span class="text-green-600">
              ₹ {{ selectedOption.offerPrice }}</span
            >
          </div>
        </div>
        <button
          @click="addingToCart"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
    <div class="mt-10 max-w-6xl mx-auto">
      <h2
        class="custom-underline text-2xl font-semibold text-gray-800 mb-2 text-center"
      >
        {{ capitalize(product.webName || product.name) }}
      </h2>
      <div class="text-gray-600 mb-4 px-4">
        <div
          v-if="product.ingredients.length !== 0"
          class="italic font-bold mb-2"
        >
          Ingredients
        </div>
        <div
          v-if="product.ingredients.length !== 0"
          class="flex gap-2 mb-10 flex-wrap"
        >
          <div
            v-for="ingredient in product.ingredients"
            class="border border-gray-600 p-1 px-2 rounded-full"
          >
            {{ ingredient }}
          </div>
        </div>
        <p v-html="product.description"></p>
      </div>
    </div>
    <div
      v-if="hasContent || product.videos.length !== 0"
      class="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md p-6 gap-6 max-w-6xl mx-auto my-4"
    >
      <div
        v-if="product.videos.length !== 0"
        :class="!hasContent ? 'w-full' : 'w-full md:w-2/3'"
      >
        <h2
          v-if="!hasContent"
          class="custom-underline text-2xl font-semibold text-gray-800 text-center mb-2"
        >
          Instructions to Use
        </h2>
        <video v-for="video in product.videos" controls autoplay class="w-full">
          <source :src="video" type="video/webm" />
        </video>
      </div>
      <div
        v-if="hasContent"
        :class="product.videos.length === 0 ? 'w-full' : 'w-full md:w-1/3'"
        class="flex flex-col text-center md:text-left"
      >
        <h2
          class="custom-underline text-2xl font-semibold text-gray-800 text-center mb-2"
        >
          Instructions to Use
        </h2>
        <div
          v-html="product.printDescription"
          class="text-left text-gray-800"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-underline {
  font-size: 2.5em;
  padding-bottom: 1em;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: url("@/assets/images/underline.svg");
}

.variant-label {
  color: #67645c;
}

.options {
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
}

.options:hover,
.options:focus,
.selected {
  border: 1px solid black;
  background-color: white;
}
</style>
