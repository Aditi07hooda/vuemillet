<script setup>
import { useCartModelVisibilty } from "~/store/cart";

const cartModelVisible = useCartModelVisibilty();
const isOpen = ref(false);
const router = useRouter();
const isSearchOpen = ref(false);
const closeModal = () => {
  isSearchOpen.value = false;
};

const menuItems = [
  {
    label: "All Categories",
    defaultOpen: false,
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
</script>

<template>
  <div
    class="flex md:justify-evenly justify-between bg-inherit w-full md:pt-4 md:px-24 p-3 items-center overflow-x-hidden"
  >
    <div class="flex justify-between items-center md:w-full">
      <UPopover overlay :popper="{ placement: 'bottom-start' }" class="">
        <UButton
          label="Shop"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          class="uppercase font-semibold hidden bg-inherit text-black items-center md:flex text-md hover:bg-inherit"
        />
        <template #panel="{ close }">
          <div
            class="grid grid-flow-row grid-cols-5 m-5 w-full mb-36 mx-20 mt-8 gap-24"
          >
            <div>
              <h3 class="uppercase text-lg font-semibold py-3">
                By Categories
              </h3>
              <div class="flex flex-col">
                <ul class="flex flex-col space-y-4">
                  <li
                    v-for="category in categories"
                    class="flex gap-3 text-sm font-medium items-center"
                  >
                    <LucideChevronRight class="w-4 h-4" />
                    <NuxtLink
                      :to="`/category/${category.slug}`"
                      @click="close"
                      class="w-full hover:text-pink-600 hover:scale-105 transition duration-500"
                    >
                      {{ capitalize(category.name) }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </UPopover>
      <div class="uppercase font-semibold hidden md:block">
        <NuxtLink to="/blogs">Blogs</NuxtLink>
      </div>
      <div class="uppercase font-semibold hidden md:block">
        <NuxtLink to="/about">About Us</NuxtLink>
      </div>
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
          <div class="flex justify-end px-14 m-5">
            <UButton
              color="gray"
              variant="ghost"
              class="-my-1"
              @click="isSearchOpen = false"
            >
              Go Back
            </UButton>
          </div>
          <SearchPopover
            :categories="categories"
            :closeModal="closeModal"
            :collections="collection"
          />
        </UModal>
      </div>
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
          >Cart</span
        >
        <UModal v-model="cartModelVisible.isCartModelOpen" prevent-close>
          <Cart />
        </UModal>
      </div>
      <div
        class="text-black md:hidden cursor-pointer"
        @click="accountNavigation"
      >
        <LucideCircleUserRound />
      </div>
      <div class="text-black md:hidden">
        <LucideShoppingBag @click="cartModelVisible.openCartModel" />
      </div>
    </div>
  </div>
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
            <div class="flex flex-col space-y-4 pl-8">
              <NuxtLink
                v-for="category in categories"
                :to="`/category/${category.slug}`"
                :key="category.slug"
                @click="handleClose"
                class="hover:text-pink-600 hover:scale-105 transition duration-500"
              >
                {{ capitalize(category.name) }}
              </NuxtLink>
            </div>
          </template>
        </UAccordion>
      </div>
    </UModal>
  </div>
</template>
