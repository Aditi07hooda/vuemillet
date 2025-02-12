<script setup>
defineProps({
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
    <div class="mt-10 col-span-4 row-span-4">
      <div class="flex gap-4 flex-wrap flex-col">
        <div class="flex flex-row gap-12">
          <div
            v-for="p in products[0].products.slice(0, 5)"
            :key="p.id"
            class="w-fit mx-3"
          >
            <NuxtLink
              :to="`/product/${p.id}`"
              @click="close"
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
      <div class="fixed bottom-6 right-8">
        <NuxtLink
          :to="`/collections`"
          @click="close"
          class="bg-pink-400 text-white hover:bg-green-400 transition duration-500 w-full py-2.5 rounded-xl px-5"
        >
        View More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
