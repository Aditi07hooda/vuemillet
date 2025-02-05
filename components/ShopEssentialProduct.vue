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
  <div class="flex-1 min-w-[calc(25%-10px)] max-w-[250px] text-center rounded-lg overflow-hidden p-8 shadow-sm shadow-[rgba(0,0,0,0.1)] mx-1 w-full sm:w-auto">
    <NuxtLink :to="`/product/${product.id}`">
      <div class="relative w-full pt-[100%] overflow-hidden rounded-lg">
        <img
          :src="product.oneImg || product.images[0] || '/favicon.ico'"
          alt="Product Image"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div class="mt-2 text-lg font-medium">{{ capitalize(product.name) }}</div>
    </NuxtLink>
    <div class="h-full">
      <NuxtLink
        :to="slug ? `/category/${slug}` : '/'"
        class="text-pink-600 font-semibold"
      >
        <span>{{ capitalize(product?.category?.name || "") }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
