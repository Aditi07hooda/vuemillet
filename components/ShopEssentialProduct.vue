<script setup>
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const isHomePage = useRoute().path === "/";

const successAddedToCart = ref(false);
const showNotification = ref(false);

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
  try {
    const data = await addToCart(
      baseURL,
      brandID,
      sessionId,
      selectedSize.value.id,
      selectedSize.value.name
    );
    console.log("Added to cart", data);
    cartModelVisible.openCartModel();
    successAddedToCart.value = true;

    showNotification.value = true; // Show the notification after adding to cart
    setTimeout(() => {
      showNotification.value = false;
    }, 5000);
  } catch (error) {
    successAddedToCart.value = false;
    showNotification.value = true; // Show error notification
    setTimeout(() => {
      showNotification.value = false;
    }, 5000);
  }
};

let slug =
  props.categories?.find((x) => x.name === props.product?.category?.name)
    ?.slug || "";
</script>

<template>
  <div class="pt-5">
    <div
      class="relative min-w-[calc(25%-10px)] max-w-[250px] border-2 rounded-lg shadow-sm shadow-[rgba(0,0,0,0.1)] w-full sm:w-auto bg-white flex flex-col items-center"
    >
      <!-- Category -->
      <div
        class="flex items-center justify-center w-full absolute top-0 -translate-y-1/2"
      >
        <div class="flex-grow border-t-2 border-gray-200 rounded-lg"></div>
        <NuxtLink :to="slug ? `/category/${slug}` : '/'">
          <div
            class="px-3 text-white text-xs font-medium whitespace-nowrap py-1 bg-pink-600 rounded"
          >
            {{ capitalize(product?.category?.name || "") }}
          </div>
        </NuxtLink>
        <div class="flex-grow border-t-2 border-gray-200 rounded-lg"></div>
      </div>

      <div
        class="flex-1 text-center overflow-hidden p-4 mx-1 mt-8 mb-2 w-full sm:w-auto flex flex-col"
      >
        <!-- Product Image (Fixed height) -->
        <NuxtLink :to="`/product/${product.slug || product.id}`">
          <div
            class="relative w-full h-[200px] overflow-hidden rounded-lg flex justify-center items-center"
          >
            <img
              :src="product.oneImg || product.images[0] || '/favicon.ico'"
              alt="Product Image"
              class="w-auto h-full max-w-full max-h-full object-contain"
            />
          </div>
        </NuxtLink>

        <!-- Product Name (Fixed height) -->
        <NuxtLink :to="`/product/${product.slug || product.id}`">
          <div
            class="mt-2 text-lg font-medium h-14 flex items-center justify-center"
          >
            {{ capitalize(product.name) }}
          </div>
        </NuxtLink>

        <!-- Selected Size (Fixed height) -->
        <div
          class="my-2 text-lg font-normal text-gray-500 h-[30px] flex items-center justify-center"
        >
          {{ selectedSize.name || selectedSize }}
        </div>

        <!-- Add to Cart Button (Aligned at Bottom) -->
        <div class="mt-auto pb-2">
          <button
            @click="addingToCart"
            class="bg-pink-600 text-white hover:bg-green-400 transition duration-500 w-fit px-4 py-1 text-base rounded-3xl"
          >
            Add to cart
          </button>
          <UNotification
            v-if="showNotification"
            :type="successAddedToCart ? 'success' : 'error'"
            :title="
              successAddedToCart
                ? 'Added to cart successfully!'
                : 'Failed to add to cart.'
            "
            :duration="3000"
            class="notification-position"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-position {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  max-width: 300px;
}
</style>
