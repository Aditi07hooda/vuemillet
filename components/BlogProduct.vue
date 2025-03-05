<script setup>
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const isHomePage = useRoute().path === "/";

const props = defineProps({
  product: { type: Object, required: true },
  categories: { type: Array, required: false },
});

const selectedSize = ref(
  containsOnlySize(props.product.variantTypes)
    ? props.product.variants?.[0]
    : props.product.variantMatrix?.Size?.[0] ||
        props.product.variantMatrix?.size?.[0] ||
        props.product.variantMatrix?.SIZE?.[0]
);

const selectedVariant = ref(
  props.product.variantMatrix?.Millet?.[0] ||
    props.product.variantMatrix?.Variant?.[0] ||
    props.product.variantMatrix?.flavour?.[0] ||
    props.product.variantMatrix?.Texture?.[0] ||
    props.product.variantMatrix?.texture?.[0] ||
    props.product.variantMatrix?.Sweetner?.[0] ||
    props.product.variantMatrix?.Packing?.[0] ||
    props.product.variantMatrix?.packing?.[0] ||
    props.product.variantMatrix?.package?.[0] ||
    props.product.variantMatrix?.Package?.[0] ||
    props.product.variantMatrix?.Pack?.[0]
);

const selectedOption = computed(() => {
  return props.product.variants.find(
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
        x.matrix.Variant === selectedVariant.value ||
        x.matrix.flavour === selectedVariant.value) &&
      (x.matrix.Size === selectedSize.value ||
        x.matrix.size === selectedSize.value ||
        x.matrix.SIZE === selectedSize.value)
  );
});

const logOption = () => {
  console.log("Selected size:", selectedSize.value);
  console.log("Selected variant", selectedVariant.value);
  console.log("select option comp", selectedOption.value);
};

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

let slug =
  props.categories?.find((x) => x.name === props.product?.category?.name)
    ?.slug || "";
</script>

<template>
  <NuxtLink :to="`/product/${product.slug || product.id}`">
    <div
      class="product-image-container h-44 mt-6 relative overflow-hidden rounded-2xl flex items-center justify-center"
    >
      <div class="h-full rounded-2xl overflow-hidden">
        <ix-img
          src="product.oneImg || product.images[0] || '/favicon.ico'"
          alt="Product Image"
          class="h-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
    <div
      class="mt-3 text-lg font-bold max-w-64 items-center flex justify-center text-center justify-self-center h-16"
    >
      {{ capitalize(product.name) }}
    </div>
  </NuxtLink>
  <div v-if="isHomePage" class="my-4">
    <NuxtLink
      :to="slug ? `/category/${slug}` : '/'"
      class="text-pink-600 font-semibold h-16"
    >
      <span>{{ capitalize(product?.category?.name || "") }}</span>
    </NuxtLink>
  </div>
  <div v-if="!isHomePage" class="product-card flex flex-col items-center h-56">
    <!-- Variant Selection -->
    <div v-if="containsOnlySize(product.variantTypes)" class="w-full">
      <div class="mb-2">Select Size</div>
      <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
        <option v-for="option in product.variants" :value="option">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div v-else class="w-full">
      <div class="mb-2">Select {{ capitalize(product?.variantTypes[0]) }}</div>
      <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
        <option
          v-for="option in product.variantMatrix[product.variantTypes[0]]"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <div class="mb-2">Select {{ capitalize(product.variantTypes[1]) }}</div>
      <select
        class="mb-2 dropdown"
        v-model="selectedVariant"
        @change="logOption"
      >
        <option
          v-for="option in product.variantMatrix[product.variantTypes[1]]"
          :value="option"
        >
          {{ capitalize(option) }}
        </option>
      </select>
    </div>

    <div class="font-bold mb-2 price-container">
      <template v-if="containsOnlySize(product.variantTypes)">
        <DiscountPriceBlock
          :price="selectedSize.price"
          :offerPrice="selectedSize.offerPrice"
        />
      </template>
      <template v-else>
        <DiscountPriceBlock
          :price="selectedOption?.price"
          :offerPrice="selectedOption?.offerPrice"
        />
      </template>
    </div>

    <!-- Add to Cart Button -->
    <div class="mt-auto w-full">
      <button
        @click="addingToCart"
        class="bg-pink-400 text-white hover:bg-green-400 transition duration-500 w-full py-2 rounded-3xl"
      >
        Add to cart
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Ensure all product cards are aligned */
.product-card {
  width: 100%;
  max-width: 100%;
  min-height: 200px;
  padding: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Image container with fixed height */
.product-image-container {
  width: 100%;
  height: 180px; /* Fixed height */
  position: relative;
  overflow: hidden; /* Keep this to clip the image */
  border-radius: 2rem; /* Apply border-radius here */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Keep object-fit as contain */
  /* Remove any explicit border-radius on the image */
}

/* Product Name (Ensures consistent height) */
.product-name {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  min-height: 40px; /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Variant Selection Dropdown */
.dropdown {
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px;
}

/* Ensure dropdowns are aligned */
.dropdown:hover,
.dropdown:focus {
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Price container */
.price-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 50px;
}

/* Add to Cart button always at the bottom */
button {
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dropdown {
    width: 100%;
    max-width: unset;
    font-size: 14px;
  }
  .product-name {
    width: 300px;
  }
}

@media (max-width: 480px) {
  .dropdown {
    width: 100%;
    font-size: 12px;
  }
  .product-name {
    width: 250px;
  }
}
</style>
