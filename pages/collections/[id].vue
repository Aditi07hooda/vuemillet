<script setup>
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const route = useRoute();
const sortOrder = ref("asc");
const sessionId = ref(null);

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const {
  data: collections,
  error: collectionsError,
  loading: collectionsLoading,
} = useFetch(`${baseURL}/store/${brandID}/collections?`, {
  headers: {
    session: sessionId.value,
  },
});

const collectionId = await findCollectionId(
  baseURL,
  brandID,
  sessionId.value,
  route.params.id
);

const {
  data: collectionProducts,
  error: collectionProductsError,
  loading: collectionProductsLoading,
} = await useFetch(
  `${baseURL}/store/${brandID}/collections/${collectionId}/products`,
  {
    headers: {
      session: sessionId.value,
    },
  }
);

const filteredCollections = computed(() => {
  watchEffect(() => {
    if (collections.value) {
      return collections.value.filter((item) => item.frontPage === true);
    }
  });
});

const collection = ref({});

watchEffect(() => {
  if (collections.value) {
    collection.value =
      collections.value.find((x) => x.id === route.params.id) || {};
  }
});
</script>

<template>
  <Head>
    <Title>{{ collection.name }}</Title>
  </Head>
  <div v-if="collectionProductsLoading">Loading...</div>
  <div v-else-if="collectionProductsError">Error: {{ error.message }}</div>
  <div v-else>
    <div class="flex flex-wrap px-14 gap-4 font-bold mt-4 justify-center">
      <NuxtLink
        v-for="c in filteredCollections"
        :to="`/collections/${c.slug || c.id}`"
        :key="c"
        class="nuxtlink"
        :class="c.id === route.params.id ? 'active' : 'transparent-underline '"
      >
        {{ capitalize(c.name) }}
      </NuxtLink>
    </div>
    <div class="hero-image px-14 mt-7 mb-5">
      <template v-if="collection?.imageUrl">
        <NuxtImg
          provider="imgix"
          :src="
            collection?.imageUrl?.startsWith('http')
              ? collection?.imageUrl?.replace(/^https?:\/\//, '')
              : collection?.imageUrl
          "
          alt="image"
          loading="lazy"
        />
      </template>
      <template v-else>
        <img
          src="/favicon.ico"
          alt="Millet Store Logo"
          class="w-80 items-center rounded-3xl shadow-md"
          loading="lazy"
        />
      </template>
      <div class="hero-overlay">
        <h1 class="text-center uppercase">{{ collection?.name }}</h1>
      </div>
    </div>
    <div class="px-14 description" v-html="collection?.description"></div>
    <h2 class="text-center my-4">Our Products</h2>
    <!-- <div class="flex justify-center w-full flex-wrap">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="mx-3 border-2 rounded-lg mb-10 shadow-md shadow-[rgba(0,0,0,0.1)] md:px-6 w-full sm:w-auto"
      >
        <BlogProduct :product="product" />
      </div>
    </div> -->
    <div class="h-full px-14">
      <UCarousel
        v-slot="{ item }"
        :items="collectionProducts"
        :ui="{
          container: 'gap-10 scroll-smooth',
          item: 'flex flex-col items-center border-2 rounded-lg shadow-md shadow-[rgba(0,0,0,0.1)] md:px-6 w-full sm:w-auto mx-3',
          nav: 'hidden',
          indicators: {
            wrapper: 'relative bottom-0 mt-4',
          },
        }"
        indicators
      >
        <BlogProduct :product="item" />
      </UCarousel>
    </div>
  </div>
</template>

<style scoped>
.filter {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 5px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  outline: none;
  width: 200px;
}

.filter:hover {
  border-color: #888;
}

.active-filter,
.filter:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.active,
.nuxtlink:hover {
  color: #94734c;
  border-bottom: 1px solid #94734c;
}

.transparent-underline {
  border-bottom: 1px solid transparent;
}

.hero-image {
  position: relative;
  width: 100%;
  height: 50vh;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
}

.hero-overlay h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-overlay p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .hero-overlay h1 {
    font-size: 2rem;
  }

  .hero-overlay p {
    font-size: 1rem;
  }

  .hero-overlay button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}

.description {
  font-size: 20px;
  font-family: "Futura PT";
}

.product-container {
  flex: 1 1 calc(25% - 10px);
  max-width: 250px;
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  padding: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .product-container {
    flex: 1 1 calc(50% - 10px);
  }
}
</style>
