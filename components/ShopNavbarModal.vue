<script setup>
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const sessionId = ref(null);

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const getSelectedCollectionProducts = ref();

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
  close: {
    type: Function,
    required: true,
  },
});

const selectedCollection = ref(props.collection[0]);

const addingToCart = async (id, name) => {
  console.log("shop navbar selected size : ", id, name);
  const sessionId = localStorage.getItem("sessionId");
  const data = await addToCart(baseURL, brandID, sessionId, id, name);
  console.log("Added to cart", data);
  cartModelVisible.openCartModel();
};

const updateSelectedCollection = async (cat) => {
  selectedCollection.value = cat;
  console.log("the selected collection is - ", selectedCollection.value);
  getSelectedCollectionProducts.value = await fetchProductsForCollection(
    baseURL,
    brandID,
    sessionId.value,
    selectedCollection?.value.id
  );
};

watchEffect(async () => {
  if (selectedCollection.value) {
    getSelectedCollectionProducts.value = await fetchProductsForCollection(
      baseURL,
      brandID,
      sessionId.value,
      selectedCollection?.value.id
    );
  }
});
</script>
<template>
  <div class="grid grid-flow-row grid-cols-5 my-5 w-full mb-20 mx-20 gap-20">
    <div>
      <h3 class="uppercase text-xl font-semibold py-3 font-poppins">
        By Categories
      </h3>
      <div class="flex flex-col md:flex-row mt-3">
        <ul class="flex flex-col space-y-6">
          <li
            v-for="category in collection"
            :key="category.name"
            class="flex gap-3 text-base font-semibold items-center hover:text-pink-600 hover:scale-105 transition duration-300 cursor-pointer"
          >
            <LucideChevronRight
              class="w-5 h-5 text-gray-500 transition duration-300 font-poppins"
              :class="{
                'text-pink-600 scale-110':
                  category.name === selectedCollection?.name,
              }"
            />
            <NuxtLink
              @click="updateSelectedCollection(category)"
              class="w-full font-poppins font-normal text-gray-700 hover:text-pink-600 hover:scale-105 transition duration-300"
              :class="{
                'text-pink-600 scale-105 font-bold':
                  category.name === selectedCollection?.name,
              }"
            >
              {{ capitalize(category.name) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-5 col-span-4 row-span-3">
      <div class="flex gap-4 flex-wrap flex-col">
        <div class="flex flex-row gap-8">
          <div
            v-for="p in getSelectedCollectionProducts?.slice(0, 3)"
            :key="p.id"
            class="w-fit mx-3"
          >
            <div class="flex w-52 h-80 contain-strict">
              <div
                class="flex-1 text-center overflow-hidden w-full sm:w-auto flex flex-col border-2 rounded-lg shadow-sm shadow-[rgba(0,0,0,0.1)]"
              >
                <NuxtLink :to="`/product/${p.slug || p.id}`" @click="close">
                  <div
                    class="relative mt-2 w-full h-[100px] overflow-hidden rounded-lg flex justify-center items-center"
                  >
                    <template v-if="p.oneImg || p.images[0]">
                      <NuxtImg
                        provider="imgix"
                        :src="
                          (p.oneImg?.startsWith('http')
                            ? p.oneImg?.replace(/^https?:\/\//, '')
                            : p.oneImg) ||
                          (p.images[0]?.startsWith('http')
                            ? p.images[0]?.replace(/^https?:\/\//, '')
                            : p.images[0])
                        "
                        alt="Product Image"
                        class="w-auto h-full max-w-full max-h-full object-contain"
                        loading="lazy"
                        sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
                      />
                    </template>
                    <template v-else>
                      <img
                        src="/favicon.ico"
                        alt="Millet Store Logo"
                        width="32"
                        height="32"
                        class="w-auto h-full max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    </template>
                  </div>
                  <div
                    class="mt-2 px-2 text-base font-medium h-[44px] flex items-center justify-center"
                  >
                    {{ capitalize(p.name) }}
                  </div>
                  <div
                    class="my-2 text-base font-normal text-gray-500 h-[35px] flex items-center justify-center"
                  >
                    {{
                      p.variantMatrix?.Size?.[0] ||
                      p.variantMatrix?.size?.[0] ||
                      p.variantMatrix?.SIZE?.[0]
                    }}
                  </div>
                  <div
                    class="my-2 text-base font-normal text-gray-500 h-[35px] flex flex-col items-center justify-center"
                  >
                    <div
                      v-if="
                        hasDiscount(
                          p.variants[0].price,
                          p.variants[0].offerPrice
                        )
                      "
                    >
                      <div class="flex gap-5 justify-center items-center">
                        <div class="text-rose-600 text-base">
                          {{
                            calculateDiscount(
                              p.variants[0].price,
                              p.variants[0].offerPrice
                            )
                          }}
                          % off
                        </div>
                        <span class="line-through me-1 text-gray-600 text-xs"
                          >₹ {{ p.variants[0].price }}</span
                        >
                      </div>
                    </div>
                    <p class="text-green-600 text-xl font-bold">
                      ₹ {{ p.variants[0].offerPrice }}
                    </p>
                  </div>
                </NuxtLink>
                <div class="pb-2">
                  <button
                    @click="
                      addingToCart(
                        p.variants[0].id,
                        p.variantMatrix?.Size?.[0] ||
                          p.variantMatrix?.size?.[0] ||
                          p.variantMatrix?.SIZE?.[0]
                      )
                    "
                    class="bg-pink-600 text-white hover:bg-green-400 transition duration-500 w-fit px-4 py-1 text-base rounded-3xl"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed bottom-6 right-8">
        <NuxtLink
          :to="`/collections/${
            selectedCollection?.slug || selectedCollection?.id
          }`"
          @click="close"
          class="bg-pink-600 text-white hover:bg-green-400 transition duration-500 w-full py-2.5 rounded-xl px-5 font-poppins"
        >
          View More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
