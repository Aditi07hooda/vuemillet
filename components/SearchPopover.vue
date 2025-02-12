<script setup>
const props = defineProps({
  categories: {
    type: Object,
    required: true,
  },
  closeModal: {
    type: Function,
    required: true,
  },
  collections: {
    type: Object,
    required: true,
  },
});

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const sessionId = ref(null);
const searchResults = ref("");
const route = useRoute().path.split("/");
const searchQuery = ref(route[1] === "search" ? route[2] : "");
const collectionProducts = ref(null);
const products = ref(null);

const collectionListCarouselRef = ref();

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const fetchResultsForEachQueryWord = async (query) => {
  try {
    const response = await fetch(
      `${baseURL}/store/${brandID}/search?q=${query}`
    );
    let r = await response.json();
    return r.results || [];
  } catch (e) {
    console.error(`Error fetching results for query "${query}":`, e);
    return [];
  }
};

const fetchResultsForQuerySentence = async () => {
  try {
    const queries = searchQuery.value.split(" ");
    let allResults = [];

    for (const query of queries) {
      const results = await fetchResultsForEachQueryWord(query);
      allResults = allResults.concat(results);
      console.log("all results", allResults);
    }

    // Remove duplicates by mapping unique IDs because there are multiple results for some products like pasta and noodles
    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [item.id, item])).values()
    );

    searchResults.value = {
      term: searchQuery.value,
      results: uniqueResults,
    };
  } catch (e) {
    console.error("Error in fetching search results:", e);
  }
};

if (searchQuery.value) {
  fetchResultsForQuerySentence();
}

const fetchCollectionProducts = async (id) => {
  try {
    const { data } = await fetchProductsForCollection(
      baseURL,
      brandID,
      sessionId.value,
      id
    );
    collectionProducts.value = data;
    return data;
  } catch (error) {
    console.error("error fetching products for collection");
  }
};

const collectionAndProducts = async () => {
  let result = [];
  for (let i = 0; i < props.collections.length; i++) {
    const data = await fetchProductsForCollection(
      baseURL,
      brandID,
      sessionId.value,
      props.collections[i].id
    );
    if (!data || data.length === 0) {
      continue;
    } else {
      result.push({
        id: i,
        collectionDetail: props.collections[i],
        products: data,
      });
    }
  }
  console.log("result of collection and products", result);
  products.value = result;
};

onMounted(() => {
  setInterval(() => {
    if (!collectionListCarouselRef.value) return;
    if (
      collectionListCarouselRef.value.page ===
      collectionListCarouselRef.value.pages
    ) {
      collectionListCarouselRef.value.select(0);
    }
    collectionListCarouselRef.value.next();
  }, 5000);
});

onMounted(async () => {
  await fetchCollectionProducts(props.collections[0].id);
  await collectionAndProducts();
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
  <div class="u-modal-content hide-scrollbar">
    <h1 class="text-center text-lg font-semibold pt-3 text-gray-600">
      Search by name
    </h1>
    <div class="md:px-14 px-5 md:m-5 mt-2 flex w-full">
      <form
        class="relative w-full md:mr-10"
        @submit.prevent="fetchResultsForQuerySentence"
      >
        <UInput
          v-model="searchQuery"
          :ui="{
            strategy: 'override',
            color: 'bg-gray-600',
            size: 'xl'
          }"
          variant="outline"
          color="green"
          class="w-full"
          placeholder="Search products by name and click enter..."
          icon="i-heroicons-magnifying-glass-20-solid"
          :trailing="true"
        />
      </form>
    </div>
    <div
      class="flex flex-wrap md:flex-nowrap md:px-14 w-full mb-36 mt-8 md:mx-5 gap-6 sm:gap-4 text-gray-600"
    >
      <div class="md:w-1/4 w-full">
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold py-3 px-5 md:px-0">
            All Categories
          </h3>
          <ul class="md:flex md:flex-col flex-row space-y-4 px-2 hidden">
            <li
              v-for="category in collections"
              :key="category.id"
              class="flex gap-3 text-sm font-medium items-center hover:text-pink-600 hover:scale-105 transition duration-500"
            >
              <NuxtLink :to="`/collections/${category.id}`" @click="closeModal">
                {{ capitalize(category.name) }}
              </NuxtLink>
            </li>
          </ul>
          <div class="block md:hidden px-3">
            <UCarousel
              v-slot="{ item }"
              :items="collections"
              :ui="{
                item: 'basis-1/5 items-center justify-center text-xsm mx-1 border bg-gray-200 hover:text-white hover:bg-pink-600 transition duration-500 rounded-lg px-2 py-2',
              }"
              indicators
            >
              <NuxtLink
                :to="`/collections/${item.id}`"
                @click="closeModal"
                class="justify-center"
              >
                <span
                  class="relative text-sm font-medium items-center justify-center hover:text-pink-600 hover:scale-105 transition duration-500"
                  >{{ item.name }}</span
                >
              </NuxtLink>
            </UCarousel>
          </div>
        </div>
      </div>
      <div v-if="!searchResults" class="md:w-3/4 w-full px-5 md:px-0">
        <div class="flex gap-4 flex-wrap flex-col">
          <div class="md:gap-12 gap-4 grid grid-flow-row grid-cols-2 items-center justify-center md:grid-cols-4">
            <div
              v-for="p in collections[0].products.slice(0, 7)"
              :key="p.id"
              class="w-fit md:mx-3 mx-1"
            >
              <div class="flex md:w-56 w-36 md:h-80 md:contain-strict">
                <div
                  class="flex-1 text-center overflow-hidden w-full sm:w-auto flex flex-col border-2 rounded-lg shadow-sm shadow-[rgba(0,0,0,0.1)]"
                >
                  <NuxtLink :to="`/product/${p.id}`" @click="close">
                    <div
                      class="relative w-full h-[100px] overflow-hidden rounded-lg flex justify-center items-center mt-3"
                    >
                      <img
                        :src="p.oneImg || p.images[0] || '/favicon.ico'"
                        alt="Product Image"
                        class="w-auto h-full max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div
                      class="mt-2 text-base font-medium md:h-[44px] flex items-center justify-center"
                    >
                      {{ capitalize(p.name) }}
                    </div>
                    <div
                      class="my-2 text-base font-normal text-gray-500 h-[35px] flex items-center justify-center"
                    >
                      {{
                        p.variants[0].name ||
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
                  <div class="pb-2 mt-2">
                    <button
                      @click="
                        addingToCart(
                          p.variants[0].id,
                          p.variants[0].name ||
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
          <div class="fixed bottom-6 right-0 md:px-14 px-5 md:m-5">
            <NuxtLink
              :to="`/collections/${collections[0].id}`"
              @click="close"
              class="bg-pink-600 text-white hover:bg-green-400 transition duration-500 w-full py-2.5 rounded-xl px-5"
            >
              View More
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="md:w-3/4 w-full px-5">
        <h3 class="text-lg font-semibold py-3">
          <template v-if="searchResults.term">
            <template v-if="searchResults.results.length !== 0">
              Showing all search results for
              <span class="text-red-600">{{ searchResults.term }}</span>
            </template>
            <template v-else
              >No results found for
              <span class="text-red-600">{{ searchResults.term }}</span>
            </template>
          </template>
          <template v-else> Recommended products </template>
        </h3>
        <div class="flex flex-wrap gap-4">
          <div class="md:gap-12 gap-4 grid grid-flow-row grid-cols-2 items-center justify-center md:grid-cols-4">
            <div v-for="p in searchResults.results" :key="p.id" class="w-fit md:mx-3 mx-1">
              <div
                class="flex flex-col items-center md:hover:text-pink-600 md:hover:scale-105 transition duration-500"
              >
                <div class="flex md:w-56 w-36 md:h-80 md:contain-strict">
                  <div
                    class="flex-1 text-center overflow-hidden w-full sm:w-auto flex flex-col border-2 rounded-lg shadow-sm shadow-[rgba(0,0,0,0.1)]"
                  >
                    <NuxtLink :to="`/product/${p.id}`" @click="close">
                      <div
                        class="relative w-full h-[100px] overflow-hidden rounded-lg flex justify-center items-center mt-3"
                      >
                        <img
                          :src="p.oneImg || p.images[0] || '/favicon.ico'"
                          alt="Product Image"
                          class="w-auto h-full max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div
                        class="mt-2 text-base font-medium md:h-[44px] flex items-center justify-center"
                      >
                        {{ capitalize(p.name) }}
                      </div>
                      <div
                        class="my-2 text-base font-normal text-gray-500 h-[30px] flex items-center justify-center"
                      >
                        {{
                          p.variants[0].name ||
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
                            p.variants[0].name ||
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
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.u-modal-content {
  max-height: 100vh;
  overflow-x: hidden;
}

.hide-scrollbar {
  overflow-y: scroll;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
