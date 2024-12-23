<script setup>
const isOpen = ref(false)
const router = useRouter()

const menuItems = [
  {
    label: "Shop",
    defaultOpen: true,
    slot: "shop",
  },
  {
    label: "Shop By Solutions",
    defaultOpen: false,
    slot: "shop-by-solutions",
  },
  {
    label: "Blogs",
    defaultOpen: false,
    slot: "blogs",
  },
  {
    label: "About Us",
    slot: "about-us",
  },
]

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const sessionId = ref(null)

if (typeof window !== "undefined") {
  sessionId.value = localStorage.getItem("sessionId")
}

if (!sessionId.value) {
  sessionId.value = await createSessionId(baseURL, brandID)
}

const {
  data: categories,
  error: categoriesError,
  loading: categoriesLoading,
} = useFetch(`${baseURL}/store/${brandID}/categories?`, {
  headers: {
    session: sessionId.value,
  },
})

console.log("category in nAv", categories.value)

const accountNavigation = () => {
  if (localStorage.getItem("user")) {
    router.push("/account")
  } else {
    router.push("/account/login")
  }
}
</script>

<template>
  <div
    class="flex md:justify-evenly justify-between bg-inherit w-full md:pt-4 md:px-24 p-3 items-center overflow-x-hidden">
    <div class="flex justify-between items-center md:w-full">
      <UPopover overlay :popper="{ placement: 'bottom-start' }" class="">
        <UButton label="Shop" trailing-icon="i-heroicons-chevron-down-20-solid"
          class="uppercase font-semibold hidden bg-inherit text-black items-center md:flex text-md hover:bg-inherit" />
        <template #panel>
          <div class="grid grid-flow-row grid-cols-5 m-5 w-full mb-36 mx-20 mt-8 gap-24">
            <div class="">
              <h3 class="uppercase text-lg font-semibold py-3">Shop</h3>
              <div class="flex flex-col">
                <ul class="flex flex-col space-y-4">
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> All Products
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="text-sm w-4 h-4" /> Best
                      Sellers
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Bundles
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Protein
                    </li>
                  </NuxtLink>
                </ul>
              </div>
            </div>
            <div class="">
              <h3 class="uppercase text-lg font-semibold py-3">By Solution</h3>
              <div class="flex flex-col">
                <ul class="flex flex-col space-y-4">
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Digestion
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="text-sm w-4 h-4" /> Protein
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Hormonal Health
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Skin & Hair
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Relax
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Energy
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Immunity
                    </li>
                  </NuxtLink>
                  <NuxtLink to="">
                    <li class="uppercase flex gap-3 text-sm font-medium items-center">
                      <LucideChevronRight class="w-4 h-4" /> Liver Health
                    </li>
                  </NuxtLink>
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
      <UButton @click="isOpen = true" label="open"
        class="md:hidden bg-inherit text-black w-fit p-0 m-0 hover:bg-inherit">
        <div class="text-black md:hidden">
          <LucideMenu />
        </div>
      </UButton>
      <div class="text-black md:hidden ml-2">
        <UPopover overlay :popper="{ placement: 'bottom-start' }" class="">
          <LucideSearch />
          <template #panel="{ close }" class="bg-gray-600">
            <SearchPopover :categories="categories" :close="close" />
          </template>
        </UPopover>
      </div>
    </div>
    <div class="flex justify-center uppercase w-full font-bold text-2xl">
      <ULink to="/">The Millet Store </ULink>
    </div>
    <div class="flex justify-between gap-3 md:w-full ">
      <UPopover overlay :popper="{ placement: 'bottom-start' }">
        <span label="Search" trailing-icon="i-heroicons-chevron-down-20-solid"
          class="uppercase font-semibold hidden bg-inherit items-center md:flex text-md hover:bg-inherit">Search</span>
        <template #panel="{ close }" class="bg-gray-600">
          <SearchPopover :categories="categories" :close="close" />
        </template>
      </UPopover>
      <NuxtLink to="/account/login" class="hidden md:block">
        <div class="uppercase font-semibold hidden md:block">Account</div>
      </NuxtLink>
      <div class="hidden md:block">
        <UPopover overlay>
          <span class="uppercase font-semibold">Cart</span>
          <template #panel>
            <div class="p-4 bg-white">
              <Cart />
            </div>
          </template>
        </UPopover>
      </div>
      <div class="text-black md:hidden cursor-pointer" @click="accountNavigation">
        <LucideCircleUserRound />
      </div>
      <div class="text-black md:hidden">
        <UPopover overlay>
          <LucideShoppingBag />
          <template #panel>
            <div class="p-4 bg-white">
              <Cart />
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </div>
  <div class="flex justify-between align-middle items-center">
    <UModal v-model="isOpen" :transition="true" class="items-center" fullscreen>
      <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
        class="-my-1 text-3xl font-bold p-5 w-12 h-12" @click="isOpen = false" />
      <UAccordion :items="menuItems" variant="soft" color="white" class="p-8">
        <template #about-us>
          <NuxtLink to="/about">About Us</NuxtLink>
        </template>
        <template #shop>
          <div class="flex flex-col space-y-4 pl-8">
            <NuxtLink to="">Shop All</NuxtLink>
            <NuxtLink to="">Best Sellers</NuxtLink>
            <NuxtLink to="">Bundles</NuxtLink>
            <NuxtLink to="">Protein</NuxtLink>
          </div>
        </template>
      </UAccordion>
    </UModal>
  </div>
</template>
