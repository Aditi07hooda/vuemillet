<script setup>
import MADE_TO_ORDER from "@/assets/images/MADE_TO_ORDER.PNG";
import NO_PRESERVATIVES from "@/assets/images/NO_PRESERVATIVES.PNG";
import ORGANIC from "@/assets/images/ORGANIC.PNG";
import JAGGERY from "@/assets/images/JAGGERY.PNG";
import MILLETS from "@/assets/images/MILLETS.PNG";
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();
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

const filteredProductVariant = computed(() => {
  return product.value.variants.map((variant) => [variant]);
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
  const data = await addToCart(
    baseURL,
    brandID,
    sessionId.value,
    selectedSize.value.id,
    selectedSize.value.name
  );
  console.log("Added to cart", data);
  cartModelVisible.openCartModel();
};

const showNavbar = ref(false);
const handleScroll = () => {
  showNavbar.value = window.scrollY >= window.innerHeight - 200;
  console.log("showNavbar", showNavbar.value);
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const isItemInCart = ref();
const variantColor = ref();
const variantImage = ref([]);

const fetchingCartItems = async () => {
  const { data } = await fetchCartItems(baseURL, brandID, sessionId.value);
  if (data && data.cart) {
    const x = data.cart.items.find(
      (item) => item.variantId === selectedSize.value?.id
    );
    console.log("Fetched cart items:", x);
    isItemInCart.value = x?.qty || 0;
  }
};

const increaseOrDecreaseQuantity = async (incrementTask) => {
  try {
    if (!selectedSize.value) {
      console.error("Selected variant not found");
      return;
    }

    let data = null;
    if (incrementTask) {
      data = await addToCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedSize.value.id,
        selectedSize.value.name
      );
      cartModelVisible.openCartModel();
    } else {
      data = await removeFromCart(
        baseURL,
        brandID,
        sessionId.value,
        selectedSize.value.id,
        selectedSize.value.name
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

const setVariantOptionMatrix = () => {
  if (product.value.variantOptionMatrix !== null) {
    variantColor.value =
      product.value.variantOptionMatrix.size[selectedSize.value.name].color;
    variantImage.value =
      product.value.variantOptionMatrix.size[selectedSize.value.name].images;

    console.log(
      "color of selected variant",
      variantColor.value,
      "images of selected variant",
      variantImage.value,
      selectedSize.value.name
    );
  } else {
    variantColor.value = "white";
  }
};

watch(selectedSize, async () => {
  await fetchingCartItems();
  setVariantOptionMatrix();
});

onMounted(async () => {
  await fetchingCartItems();
  setVariantOptionMatrix();
});
</script>

<template>
  <Head>
    <Title>{{ product.name || product.webName }}</Title>
  </Head>
  <ClientOnly>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-if="showNavbar" class="md:ease-in-out md:duration-300">
        <CartNavbar
          :productImage="product.images[0]"
          :addToCart="addingToCart"
        />
      </div>
      <div
        :style="{ backgroundColor: variantColor }"
        class="flex flex-col md:flex-row items-center rounded-lg shadow-md p-6 gap-6 max-w-6xl mx-auto my-4"
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
            v-if="product.images.length > 1 || variantImage.length > 0"
            class="flex flex-row mt-4 md:flex-col md:mt-0 md:ml-4 md:justify-end"
          >
            <div
              v-for="(image, index) in [
                ...(product?.images || []),
                ...(variantImage || []),
              ]"
              :key="index"
              class="mr-2 md:mb-2 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow rounded-lg"
            >
              <img
                :src="image"
                :alt="image"
                width="100"
                class="w-[100px] h-[100px] object-cover rounded-lg"
                @click="changeMainImage(image)"
              />
            </div>
          </div>
        </div>
        <div
          class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
        >
          <p
            class="custom-underline md:text-2xl text-lg/10 font-semibold text-gray-800 mb-2 text-center"
          >
            {{ capitalize(product.name || product.webName) }}
          </p>
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
                {{
                  capitalize(tag) === "Jaggery" ? "No Sugar" : capitalize(tag)
                }}
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
              <div
                class="flex flex-wrap w-full ml-3 gap-3"
                v-if="product.variantMatrixSelect.size === 'TABS'"
              >
                <div
                  v-for="option in product.variants"
                  :key="option"
                  @click="logOptionSize(option)"
                  class="px-4 mb-2 p-2 options cursor-pointer border-2 border-black flex gap-3 rounded items-center"
                  :class="selectedSize === option ? 'selected' : ''"
                >
                  <img :src="variantImage[0]" class="rounded h-7 w-fit"/>{{ option.name }}
                </div>
              </div>
              <div
                class="flex flex-wrap"
                v-else-if="product.variantMatrixSelect.size === 'Pills'"
              >
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
              <div
                class="flex flex-wrap w-full ml-3"
                v-else-if="product.variantMatrixSelect.size === 'DROPDOWN'"
              >
                <UDropdown
                  :items="filteredProductVariant"
                  :ui="{
                    item: { disabled: 'cursor-text select-text w-full' },
                    width: '100%',
                  }"
                  :popper="{ placement: 'bottom-start' }"
                >
                  <UButton
                    color="white"
                    :label="selectedSize ? selectedSize.name : 'Options'"
                    trailing-icon="i-heroicons-chevron-down-20-solid"
                  />

                  <template #item="{ item }">
                    <span @click="logOptionSize(item)" class="cursor-pointer">{{
                      item.name
                    }}</span>
                  </template>
                </UDropdown>
              </div>
              <div class="flex flex-wrap" v-else>
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
                  v-for="option in product.variantMatrix[
                    product.variantTypes[0]
                  ]"
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
                  v-for="option in product.variantMatrix[
                    product.variantTypes[1]
                  ]"
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
            <template v-if="containsOnlySize(product.variantTypes)">
              <DiscountPriceBlock
                :price="selectedSize.price"
                :offerPrice="selectedSize.offerPrice"
                :style="`font-size: 1.8rem; line-height: 3rem;`"
              />
            </template>
            <template v-else>
              <DiscountPriceBlock
                :price="selectedOption?.price"
                :offerPrice="selectedOption?.offerPrice"
                :style="`font-size: 1.8rem; line-height: 3rem;`"
              />
            </template>
          </div>
          <div v-if="isItemInCart === 0" class="flex items-center mt-6">
            <button
              @click="increaseOrDecreaseQuantity(true)"
              class="bg-pink-500 w-full text-white font-semibold hover:bg-pink-600 transition duration-300 px-5 py-2 rounded shadow-md"
            >
              Add to cart
            </button>
          </div>

          <div
            v-else
            class="flex items-center gap-2 border border-pink-600 mt-6 rounded-lg bg-white shadow-md w-full"
          >
            <button
              @click="increaseOrDecreaseQuantity(false)"
              class="px-3 py-2 font-extrabold rounded text-lg text-gray-700 border-r border-pink-600 hover:text-white hover:bg-pink-600 transition w-1/2"
            >
              −
            </button>
            <p
              class="px-4 py-2 text-lg font-semibold text-gray-800 w-full flex justify-center align-center cursor-default"
            >
              {{ isItemInCart }}
            </p>
            <button
              @click="increaseOrDecreaseQuantity(true)"
              class="px-3 py-2 font-extrabold rounded text-lg text-gray-700 border-l border-pink-600 hover:text-white hover:bg-pink-600 transition w-1/2"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div class="mt-10 max-w-6xl mx-auto w-full">
        <p
          class="custom-underline md:text-3xl flex flex-wrap text-lg/7 mx-auto px-5 font-semibold text-gray-800 mb-2 justify-center"
        >
          {{ capitalize(product.webName || product.name) }}
        </p>
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
              class="border border-gray-600 p-1 px-2 rounded-full cursor-pointer"
            >
              <NuxtLink :to="`/search/${ingredient}`">
                {{ capitalize(ingredient) }}
              </NuxtLink>
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
          <video
            v-for="video in product.videos"
            controls
            autoplay
            class="w-full"
          >
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
  </ClientOnly>
</template>

<style scoped>
.custom-underline {
  padding-bottom: 1em;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: url("@/assets/images/underline.svg");
  background-size: auto 0.9em;
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
