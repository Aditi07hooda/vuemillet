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

onMounted(async () => {
  await fetchCollectionProducts(props.collections[0].id);
  await collectionAndProducts();
});
</script>

<template>
  <div class="u-modal-content hide-scrollbar">
    <h1 class="text-center text-lg font-semibold pt-3 text-gray-600">
      Search by name
    </h1>
    <div class="px-14 m-5 mt-2 flex w-full">
      <form
        class="relative w-full"
        @submit.prevent="fetchResultsForQuerySentence"
      >
        <UInput
          v-model="searchQuery"
          :ui="{
            strategy: 'override',
            color: 'bg-gray-600',
          }"
          variant="outline"
          color="green"
          class="w-full pr-12"
          placeholder="Search products by name and click enter..."
        />
      </form>
    </div>
    <div
      class="flex flex-wrap md:flex-nowrap px-14 w-full mb-36 mt-8 mx-5 gap-6 sm:gap-4 text-gray-600"
    >
      <div class="md:w-1/4 w-full">
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold py-3">All Categories</h3>
          <ul class="flex flex-col space-y-4">
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
        </div>
      </div>
      <div v-if="!searchResults" class="md:w-3/4 w-full">
        <div class="flex gap-4 flex-wrap flex-col">
          <div v-for="collection in products" :key="collection.id" class="">
            <NuxtLink
              :to="`/collections/${collection.collectionDetail.id}`"
              @click="closeModal"
              class="hover:text-pink-600 hover:scale-105 transition duration-500"
            >
              <h4 class="text-lg font-semibold py-3">
                {{ collection.collectionDetail.name }}
              </h4>
            </NuxtLink>
            <div v-for="p in collection.products" :key="p.id" class="w-full">
              <NuxtLink
                :to="`/product/${p.id}`"
                @click="closeModal"
                class="flex flex-col hover:text-pink-600 hover:scale-105 transition duration-500"
              >
                <img
                  :src="p.oneImg || p.images[0] || '/favicon.ico'"
                  :alt="p.name"
                  class="w-[150px] h-[150px] object-cover rounded-lg"
                />
                <div class="w-[150px] mt-2 font-normal text-sm">
                  {{ p.name }}
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="md:w-3/4 w-full">
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
          <div v-for="product in searchResults.results" :key="product.id">
            <NuxtLink
              :to="`/product/${product.id}`"
              @click="closeModal"
              class="flex flex-col items-center hover:text-pink-600 hover:scale-105 transition duration-500"
            >
              <img
                :src="product.oneImg || product.images[0] || '/favicon.ico'"
                :alt="product.name"
                class="w-[150px] h-[150px] object-cover rounded-lg"
              />
              <div class="w-[150px] mt-2 font-semibold">
                {{ capitalize(product.name) }}
              </div>
            </NuxtLink>
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
