<script setup>
import { useCartModelVisibilty } from "~/store/cart";
import { X } from "lucide-vue-next";

const cartModelVisible = useCartModelVisibilty();
const isOpen = ref(false);
const router = useRouter();
const isSearchOpen = ref(false);
const closeModal = () => {
  isSearchOpen.value = false;
};
const collectionProducts = ref(null);
const products = ref(null);
const cartLength = ref(0);

const shopClose = ref(false);

const handleShopClose = () => {
  shopClose.value = true;
};

const menuItems = [
  {
    label: "All Categories",
    defaultOpen: true,
    slot: "categories",
  },
  {
    label: "Learn",
    slot: "learn",
  },
];

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
  data: collection,
  error: collectionError,
  loading: collectionLoading,
} = useFetch(`${baseURL}/store/${brandID}/collections`, {
  headers: {
    session: sessionId.value,
  },
});

const accountNavigation = () => {
  if (localStorage.getItem("user")) {
    router.push("/account");
  } else {
    router.push("/account/login");
  }
};
const handleClose = () => {
  isOpen.value = false;
  // nextTick(()=>{
  //   $router.push(r)
  // })
};

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
  for (let i = 0; i < collection.value.length; i++) {
    const data = await fetchProductsForCollection(
      baseURL,
      brandID,
      sessionId.value,
      collection.value[i].id
    );
    if (!data || data.length === 0) {
      continue;
    } else {
      result.push({
        id: i,
        collectionDetail: collection.value[i],
        products: data,
      });
    }
  }
  console.log("result of collection and products", result);
  products.value = result;
};

onMounted(async () => {
  // Wait until collection is loaded before accessing its elements
  watchEffect(async () => {
    if (collection.value) {
      await fetchCollectionProducts(collection.value[0].id);
      await collectionAndProducts();
    }
  });
  const { data, productImage } = await fetchCartItems(
    baseURL,
    brandID,
    sessionId.value
  );
  cartLength.value = data.cart.items.length;
});
</script>

<template>
  <div
    class="flex md:justify-evenly justify-between bg-inherit w-full md:pt-4 md:px-24 p-3 items-center overflow-x-hidden"
  >
    <div class="flex justify-between items-center md:w-full">
      <!-- shop large and small screen -->
      <UPopover
        overlay
        :popper="{ placement: 'bottom-start' }"
        class=""
        v-model:open="shopClose"
      >
        <UButton
          label="Shop"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          class="uppercase font-semibold hidden bg-inherit text-black items-center md:flex text-md hover:bg-inherit"
        />
        <template #panel="{ close }">
          <div class="flex justify-end md:px-1 mx-3 mt-3">
            <UButton color="gray" variant="ghost" class="-my-1" @click="close">
              <X class="text-gray-400 w-4 h-4 md:w-8 md:h-8" />
            </UButton>
          </div>
          <ShopNavbarModal
            :collection="collection"
            :products="products"
            :close="close"
          />
        </template>
      </UPopover>

      <!-- blogs and about us large screen -->
      <div class="uppercase font-semibold hidden md:block">
        <NuxtLink to="/blogs">Blogs</NuxtLink>
      </div>
      <div class="uppercase font-semibold hidden md:block">
        <NuxtLink to="/about">About Us</NuxtLink>
      </div>

      <!-- menu and search small screen -->
      <UButton
        @click="isOpen = true"
        label="open"
        class="md:hidden bg-inherit text-black w-fit p-0 m-0 hover:bg-inherit"
      >
        <div class="text-black md:hidden">
          <LucideMenu />
        </div>
      </UButton>
      <div class="text-black md:hidden ml-2">
        <LucideSearch @click="isSearchOpen = true" />
      </div>
    </div>

    <div
      class="flex justify-center uppercase w-full font-bold md:text-2xl text-xl"
    >
      <ULink to="/">The Millet Store </ULink>
    </div>

    <div class="flex justify-between gap-3 md:w-full">
      <!-- search large screen -->
      <span
        label="Search"
        trailing-icon="i-heroicons-chevron-down-20-solid"
        class="uppercase font-semibold hidden bg-inherit items-center md:flex text-md hover:bg-inherit cursor-pointer"
        @click="isSearchOpen = true"
      >
        Search</span
      >
      <div class="bg-red-600">
        <UModal v-model="isSearchOpen" fullscreen prevent-close>
          <div class="flex justify-end md:px-14 m-5">
            <UButton
              color="gray"
              variant="ghost"
              class="-my-1"
              @click="isSearchOpen = false"
            >
              <X class="text-gray-400 w-4 h-4 md:w-8 md:h-8" />
            </UButton>
          </div>
          <SearchPopover
            :categories="categories"
            :closeModal="closeModal"
            :collections="collection"
          />
        </UModal>
      </div>

      <!-- account and cart large screen -->
      <div
        class="uppercase font-semibold hidden md:block cursor-pointer"
        @click="accountNavigation"
      >
        Account
      </div>
      <div class="hidden md:block">
        <span
          class="uppercase font-semibold cursor-pointer"
          @click="cartModelVisible.openCartModel"
          >Cart ({{ cartLength }})</span
        >
        <USlideover v-model="cartModelVisible.isCartModelOpen">
          <Cart />
        </USlideover>
      </div>
      <!-- account and cart small screen -->
      <div
        class="text-black md:hidden cursor-pointer"
        @click="accountNavigation"
      >
        <LucideCircleUserRound />
      </div>
      <div class="text-black md:hidden">
        <UChip :text="cartLength" size="2xl">
          <LucideShoppingBag @click="cartModelVisible.openCartModel" />
        </UChip>
      </div>
    </div>
  </div>

  <!-- shop small screen content -->
  <div class="flex justify-between align-middle items-center">
    <UModal v-model="isOpen" :transition="true" class="items-center" fullscreen>
      <div class="u-modal-content hide-scrollbar">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1 text-3xl font-bold p-5 w-12 h-12"
          @click="isOpen = false"
        />
        <UAccordion :items="menuItems" variant="soft" color="white" class="p-8">
          <template #learn>
            <div class="flex flex-col space-y-4 pl-8">
              <NuxtLink
                to="/blogs"
                class="hover:text-pink-600 hover:scale-105 transition duration-500"
                @click="handleClose"
              >
                Blogs
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="hover:text-pink-600 hover:scale-105 transition duration-500"
                @click="handleClose"
              >
                About Us
              </NuxtLink>
            </div>
          </template>
          <template #categories>
            <div
              class="md:flex md:flex-col grid grid-flow-row grid-cols-2 gap-4"
            >
              <NuxtLink
                v-for="category in collection"
                :to="`/collections/${category.id}`"
                :key="category.id"
                @click="handleClose"
                class="hover:text-pink-600 hover:scale-105 transition duration-500"
              >
                <div
                  class="flex flex-col md:flex-row items-center justify-center gap-2"
                >
                  <img
                    :src="category?.imageUrl || '/favicon.ico'"
                    alt="image"
                    class="h-10 w-10 rounded-lg"
                  />
                  <h1 class="text-center">
                    {{ category?.name }}
                  </h1>
                </div>
              </NuxtLink>
            </div>
          </template>
        </UAccordion>
      </div>
    </UModal>
  </div>
</template>
