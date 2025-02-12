<script setup>
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
  products: {
    type: Object,
    required: true,
  },
  close: {
    type: Function,
    required: true,
  },
});

const addingToCart = async (id, name) => {
  console.log("shop navbar selected size : ", id, name);
  const sessionId = localStorage.getItem("sessionId");
  const data = await addToCart(baseURL, brandID, sessionId, id, name);
  console.log("Added to cart", data);
  cartModelVisible.openCartModel();
};

</script>
<template>
  <div class="grid grid-flow-row grid-cols-5 m-5 w-full mb-36 mx-20 gap-24">
    <div>
      <h3 class="uppercase text-lg font-semibold py-3">By Categories</h3>
      <div class="flex flex-col md:flex-row">
        <ul class="flex flex-col space-y-4">
          <li
            v-for="category in collection"
            class="flex gap-3 text-sm font-medium items-center hover:text-pink-600 hover:scale-105 transition duration-500"
          >
            <LucideChevronRight
              class="w-4 h-4 hover:text-pink-600 hover:scale-105 transition duration-500"
              :class="{
                'text-pink-600 scale-105 transition duration-500':
                  category.name === collection[0].name,
              }"
            />
            <NuxtLink
              :to="`/collections/${category.id}`"
              @click="close"
              class="w-full hover:text-pink-600 hover:scale-105 transition duration-500"
              :class="{
                'text-pink-600 scale-105 transition duration-500':
                  category.name === collection[0].name,
              }"
            >
              {{ capitalize(category.name) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-5 col-span-4 row-span-4">
      <div class="flex gap-4 flex-wrap flex-col">
        <div class="flex flex-row gap-12">
          <div
            v-for="p in products[0].products.slice(0, 7)"
            :key="p.id"
            class="w-fit mx-3"
          >
            <div class="flex w-56 h-60 contain-strict">
              <div
                class="flex-1 text-center overflow-hidden w-full sm:w-auto flex flex-col border-2 rounded-lg shadow-sm shadow-[rgba(0,0,0,0.1)]"
              >
                <NuxtLink :to="`/product/${p.id}`" @click="close">
                  <div
                    class="relative w-full h-[100px] overflow-hidden rounded-lg flex justify-center items-center"
                  >
                    <img
                      :src="p.oneImg || p.images[0] || '/favicon.ico'"
                      alt="Product Image"
                      class="w-auto h-full max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div
                    class="mt-2 text-base font-medium h-[40px] flex items-center justify-center"
                  >
                    {{ capitalize(p.name) }}
                  </div>
                  <div
                    class="my-2 text-base font-normal text-gray-500 h-[30px] flex items-center justify-center"
                  >
                    {{
                      p.variantMatrix?.Size?.[0] ||
                      p.variantMatrix?.size?.[0] ||
                      p.variantMatrix?.SIZE?.[0]
                    }}
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
          :to="`/collections/${collection[0].id}`"
          @click="close"
          class="bg-pink-600 text-white hover:bg-green-400 transition duration-500 w-full py-2.5 rounded-xl px-5"
        >
          View More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
