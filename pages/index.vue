<template>
  <Head>
    <Title>The Millet Store - We Make Food Delicious</Title>
  </Head>
  <div v-if="categoriesLoading || blogsLoading">Loading...</div>
  <div v-else-if="categoriesError || blogsError">
    <div v-if="categoriesError">
      Categories Error: {{ categoriesError.message }}
    </div>
    <div v-if="blogsError">Blogs Error: {{ blogsError.message }}</div>
  </div>
  <div v-else>
    <h2 class="text-center mt-5">Prioritizing Holistic Health</h2>
    <h3 class="text-center mb-10">
      Overwhelmed by quick fixes and diet culture, we bring you nutritious,
      healthy and yet very delicious items
    </h3>
    <!-- <UCarousel
        v-slot="{ item }"
        :items="categories"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3 flex flex-col gap-4',
        }"
        indicators
        class="rounded-lg overflow-hidden"
      >
        <div class="w-full space-y-4 px-2">
          <NuxtLink :to="`/category/${item.slug}`">
            <NuxtImg
              provider="imgix"
              src="item.imageUrl"
              class="w-full rounded-3xl shadow-md"
              draggable="false"
              loading="lazy"
              sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
            />
            <div class="flex justify-center">
              <p
                class="text-sm mb-10 mt-2 text-center border border-black border-2 rounded-3xl p-2 w-1/2 hover:bg-pink-600 transition duration-500"
              >
                {{ item.name }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </UCarousel> -->
    <UCarousel
      v-slot="{ item }"
      :items="filteredCollections"
      :ui="{
        item: 'basis-full md:basis-1/3 lg:basis-1/4 flex flex-col gap-4',
        container: 'scroll-smooth',
      }"
      indicators
      class="rounded-lg overflow-hidden"
    >
      <div class="w-full space-y-4 px-2" v-if="item.frontPage !== false">
        <NuxtLink
          :to="`/collections/${item.slug || item.id}`"
          class="flex flex-col align-center items-center"
          style="width: 100%"
        >
          <template v-if="item.imageUrl">
            <NuxtImg
              provider="imgix"
              :src="
                item?.imageUrl?.startsWith('http')
                  ? item?.imageUrl?.replace(/^https?:\/\//, '')
                  : item?.imageUrl
              "
              draggable="false"
              loading="lazy"
              class="w-80 items-center rounded-3xl shadow-md"
              sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
            />
          </template>
          <template v-else>
            <img
              src="/favicon.ico"
              alt="Millet Store Logo"
              width="320"
              height="80"
              class="items-center rounded-3xl shadow-md"
              loading="lazy"
            />
          </template>
          <div class="flex justify-center w-full">
            <p
              class="text-sm mb-10 mt-2 text-center border-black border-2 rounded-3xl p-2 w-1/2 hover:bg-pink-600 transition duration-500"
            >
              {{ item.name }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </UCarousel>

    <!-- shop essential -->
    <div class="shop">
      <h2 class="text-center mt-5">Shop the essentials</h2>
      <div class="p-8">
        <div class="w-full h-full">
          <UCarousel
            v-slot="{ item }"
            :items="products.results"
            :ui="{
              container: 'gap-4 scroll-smooth',
              item: 'flex flex-col items-center',
              nav: 'hidden',
              indicators: {
                wrapper: 'relative bottom-0 mt-4',
              },
            }"
            indicators
          >
            <ShopEssentialProduct :product="item" :categories="categories" />
          </UCarousel>
        </div>
      </div>
    </div>

    <!-- blog -->
    <div class="text-center my-5">
      <h2 class="uppercase">Commited to being education first</h2>
      <h3 class="mb-2">
        Learn with us as we dive deeper into root causes and all about that
        holistic life!
      </h3>
      <h3 class="uppercase underline">
        <NuxtLink to="/blogs">Our Blogs</NuxtLink>
      </h3>
      <div class="p-8">
        <UCarousel
          ref="blogCarouselRef"
          v-slot="{ item }"
          :items="blogs"
          :ui="{
            container: 'gap-16 scroll-smooth',
            item: 'flex flex-col items-center',
            nav: 'hidden',
          }"
          indicators
        >
          <div class="blog-item">
            <Blog :blog="item" />
          </div>
        </UCarousel>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const brandID = config.public.brandID;
const sessionId = ref(null);

const blogCarouselRef = ref();

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId");
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID);
}

const {
  data: categories,
  error: categoriesError,
  loading: categoriesLoading,
} = useFetch(`${baseURL}/store/${brandID}/categories?`, {
  headers: {
    session: sessionId.value,
  },
});

const {
  data: collections,
  error: collectionsError,
  loading: collectionsLoading,
} = useFetch(`${baseURL}/store/${brandID}/collections?`, {
  headers: {
    session: sessionId.value,
  },
});

const filteredCollections = computed(() => {
  return collections.value.filter((item) => item.frontPage === true);
});

const {
  data: blogs,
  error: blogsError,
  loading: blogsLoading,
} = await useFetch(`${baseURL}/store/${brandID}/blogs`);

const {
  data: products,
  error: productsError,
  loading: productsLoading,
} = await useFetch(`${baseURL}/store/${brandID}/search?q=`);
console.log("recom product", products.value);

onMounted(() => {
  setInterval(() => {
    if (!blogCarouselRef.value) return;
    if (blogCarouselRef.value.page === blogCarouselRef.value.pages) {
      blogCarouselRef.value.select(0);
    }
    blogCarouselRef.value.next();
  }, 5000);
});
</script>

<style>
* {
  font-family: "Futura PT";
}

.blog-item {
  max-height: 500px;
  width: 300px;
  height: 330px;
  color: #67645b;
}

h2 {
  font-weight: 900;
  font-size: 35px;
}

h3 {
  font-size: 20px;
}
</style>
