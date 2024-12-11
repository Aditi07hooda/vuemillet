<script setup>
const isOpen = ref(false);

const menuItems = [
  {
    label: "Shop",
    defaultOpen: true,
    slot: "shop"
  },
  {
    label: "Shop By Solutions",
    defaultOpen: false,
    slot: "shop-by-solutions"
  },
  {
    label: "Learn",
    defaultOpen: false,
    slot: "learn"
  },
  {
    label: "About Us",
    slot: "about-us",
  },
  
];
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
        <template #panel>
          <div
            class="grid grid-flow-row grid-cols-5 m-5 w-full mb-36 mx-20 mt-8 gap-24"
          >
            <div class="">
              <h3 class="uppercase text-lg font-semibold py-3">Shop</h3>
              <div class="flex flex-col">
                <ul class="flex flex-col space-y-4">
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> All Products
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="text-sm w-4 h-4" /> Best
                      Sellers
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Bundles
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Protein
                    </li>
                  </a>
                </ul>
              </div>
            </div>
            <div class="">
              <h3 class="uppercase text-lg font-semibold py-3">By Solution</h3>
              <div class="flex flex-col">
                <ul class="flex flex-col space-y-4">
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Digestion
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="text-sm w-4 h-4" /> Protein
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Hormonal Health
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Skin & Hair
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Relax
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Energy
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Immunity
                    </li>
                  </a>
                  <a href="">
                    <li
                      class="uppercase flex gap-3 text-sm font-medium items-center"
                    >
                      <LucideChevronRight class="w-4 h-4" /> Liver Health
                    </li>
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <div class="uppercase font-semibold hidden md:block">Learn</div>
      <div class="uppercase font-semibold hidden md:block">
        <a href="/about">About Us</a>
      </div>

      <UButton @click="isOpen = true" label="open" class="md:hidden bg-inherit text-black w-fit p-0 m-0 hover:bg-inherit">
        <div class="text-black md:hidden">
          <LucideMenu />
        </div>
      </UButton>

      <div class="text-black md:hidden ml-2">
        <LucideSearch />
      </div>
    </div>
    <div class="flex justify-center uppercase w-full font-bold text-2xl">
      <ULink to="/"> Millet </ULink>
    </div>
    <div class="flex justify-between gap-3 md:w-full">
      <div class="uppercase font-semibold hidden md:block">Search</div>
      <div class="uppercase font-semibold hidden md:block">Account</div>
      <div class="uppercase font-semibold hidden md:block">Cart</div>

      <div class="text-black md:hidden">
        <LucideCircleUserRound />
      </div>
      <div class="text-black md:hidden">
        <LucideShoppingBag />
      </div>
    </div>
  </div>
  <div class="flex justify-between align-middle items-center">
    <UModal v-model="isOpen" :transition="true" class="items-center" fullscreen>
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="-my-1 text-3xl font-bold p-5 w-12 h-12"
        @click="isOpen = false"
      />
      <UAccordion :items="menuItems" variant="soft" color="white" class="p-8">
        <template #about-us>
          <a href="/about">About Us</a>
        </template>

        <template #shop>
            <div class="flex flex-col space-y-4 pl-8">
                <a href="/about">Shop All</a>
                <a href="/about">Best Sellers</a>
                <a href="/about">Bundles</a>
                <a href="/about">Protein</a>
            </div>
        </template>
      </UAccordion>
    </UModal>
  </div>
</template>
