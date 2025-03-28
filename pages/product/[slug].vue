<script setup>
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
      return "/images/MADE_TO_ORDER.png";
    case "no_preservatives":
      return "/images/NO_PRESERVATIVES.png";
    case "organic":
      return "/images/ORGANIC.png";
    case "jaggery":
      return "/images/JAGGERY.png";
    case "millets":
      return "/images/MILLETS.png";
    default:
      return "/images/default.png"; // Fallback image (optional)
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

// This is needed because sometimes the printDescription only contains tags but not text content inside
const hasContent = computed(() => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = product.value.printDescription;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  return textContent.trim().length > 0;
});

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
const matchingVariant = ref();

const findVariant = () => {
  const hasMultipleVariantTypes = product.value.variantTypes.length > 1;

  if (hasMultipleVariantTypes) {
    matchingVariant.value = product.value.variants.find((variant) => {
      const selectedSizeName = selectedSize.value;
      const variantSize =
        variant.matrix.size || variant.matrix.Size || variant.matrix.SIZE;

      return (
        variantSize === selectedSizeName &&
        variant.matrix[product.value.variantTypes[1]] === selectedVariant._value
      );
    });
  } else {
    const selectedSizeName = selectedSize.value.name;
    matchingVariant.value = product.value.variants.find((variant) => {
      const variantSize =
        variant.matrix.size || variant.matrix.Size || variant.matrix.SIZE;
      return variantSize === selectedSizeName;
    });
  }
};

const fetchingCartItems = async () => {
  const { data } = await fetchCartItems(baseURL, brandID, sessionId.value);
  const currentVariant = matchingVariant.value;
  if (data && data.cart) {
    const x = data.cart.items.find(
      (item) => item.variantId === currentVariant?.id
    );
    console.log("Fetched cart items:", x);
    isItemInCart.value = x?.qty || 0;
  }
};

const increaseOrDecreaseQuantity = async (incrementTask) => {
  try {
    if (!matchingVariant) {
      console.log("value of variant -", selectedSize.value.name);
      console.error("Matching variant not found");
      return;
    }
    console.log(
      matchingVariant.value,
      selectedSize.value,
      selectedVariant._value
    );

    let data = null;
    if (incrementTask) {
      data = await addToCart(
        baseURL,
        brandID,
        sessionId.value,
        matchingVariant.value.id,
        matchingVariant.value.name
      );
      cartModelVisible.openCartModel();
    } else {
      data = await removeFromCart(
        baseURL,
        brandID,
        sessionId.value,
        matchingVariant.value.id,
        matchingVariant.value.name
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
    variantColor.value = {};
    variantImage.value = {};

    Object.entries(product.value.variantOptionMatrix).forEach(
      ([variantType, variants]) => {
        Object.entries(variants).forEach(([variant, data]) => {
          if (!variantColor.value) variantColor.value = {};
          if (!variantImage.value) variantImage.value = {};

          variantColor.value[variant] = data.color;
          variantImage.value[variant] = data.images;
        });
      }
    );
  }
};

watch(selectedSize, async () => {
  findVariant();
  await fetchingCartItems();
  setVariantOptionMatrix();
});

watch(selectedVariant, async () => {
  findVariant();
  await fetchingCartItems();
});

onMounted(async () => {
  findVariant();
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
      <div v-if="showNavbar" class="ease-in-out duration-300">
        <CartNavbar
          :productImage="product.images[0]"
          :addToCart="addingToCart"
        />
      </div>
      <div
        class="flex flex-col md:flex-row items-center rounded-lg shadow-md p-6 gap-6 max-w-6xl mx-auto my-4"
      >
        <div class="w-full md:w-1/2 flex flex-col md:flex-row">
          <div class="w-full">
            <NuxtImg
              provider="imgix"
              :src="
                mainImg?.startsWith('http')
                  ? mainImg?.replace(/^https?:\/\//, '')
                  : mainImg
              "
              alt="Product Image"
              class="w-full h-auto rounded-lg object-cover shadow"
              loading="lazy"
              format="webp"
              sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
            />
          </div>
          <div
            v-if="product.images.length > 1 || variantImage.length > 0"
            class="flex flex-row mt-4 md:flex-col md:mt-0 md:ml-4 md:justify-end"
          >
            <div
              v-if="
                product.images.length > 0 ||
                (variantImage[selectedSize] &&
                  variantImage[selectedSize].length > 0)
              "
              class="flex flex-row mt-4 md:flex-col md:mt-0 md:ml-4 md:justify-end"
            >
              <div
                v-for="(image, index) in [
                  ...(product?.images || []),
                  ...(variantImage[selectedSize.name] || []),
                ]"
                :key="index"
                class="mr-2 md:mb-2 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow rounded-lg"
              >
                <NuxtImg
                  provider="imgix"
                  :src="
                    image?.startsWith('http')
                      ? image?.replace(/^https?:\/\//, '')
                      : image
                  "
                  alt="image"
                  width="100"
                  format="webp"
                  class="w-[100px] h-[100px] object-cover rounded-lg"
                  @click="changeMainImage(image)"
                  loading="lazy"
                  sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
                />
              </div>
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
                <img
                  :src="getSrcFromTags(tag)"
                  alt="tag"
                  width="70px"
                  loading="lazy"
                  sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
                />
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
              <VariantSizeSelection
                :product="product"
                :variantImage="variantImage"
                :variantColor="variantColor"
                :selectedSize="selectedSize"
                @update:selectedSize="selectedSize = $event"
                :is-contain-size="true"
              />
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
                <VariantSizeSelection
                  :product="product"
                  :variantImage="variantImage"
                  :variantColor="variantColor"
                  :selectedSize="selectedSize"
                  @update:selectedSize="selectedSize = $event"
                  :is-contain-size="false"
                />
              </div>
            </div>
            <div class="flex">
              <div
                class="mb-2 w-2/12 variant-label font-semibold flex items-center"
              >
                {{ capitalize(product.variantTypes[1]) }}
              </div>
              <div class="flex flex-wrap w-10/12">
                <VariantTypeSelection
                  :product="product"
                  :selectedVariant="selectedVariant"
                  :variantImage="variantImage"
                  :variantColor="variantColor"
                  @update:selectedVariant="selectedVariant = $event"
                />
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
  background-image: url("/images/underline.svg");
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
