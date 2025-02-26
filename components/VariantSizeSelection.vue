<template>
  <div v-if="isContainSize">
    <div
      class="flex flex-wrap w-full ml-3 gap-3"
      v-if="product.variantMatrixSelect.size === 'TABS'"
    >
      <div
        v-for="option in product.variants"
        :key="option?.name"
        @click="logOptionSize(option)"
        class="px-4 mb-2 p-2 options cursor-pointer border-2 border-black flex gap-3 rounded items-center"
        :class="selectedSize === option ? 'border border-black bg-white' : ''"
      >
        <img :src="variantImage[option.name]?.[0]" class="rounded h-7 w-fit" />
        {{ option.name }}
      </div>
    </div>

    <div
      class="flex flex-wrap"
      v-else-if="product.variantMatrixSelect.size === 'PILLS'"
    >
      <div
        v-for="option in product.variants"
        :key="option?.name"
        @click="logOptionSize(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options border-2 cursor-pointer flex items-center gap-2"
        :class="selectedSize === option ? 'border border-black bg-white' : ''"
      >
        <p
          class="rounded-full w-5 h-5 inline-block"
          :style="{
            backgroundColor: variantColor[option?.name] || 'gray',
          }"
        ></p>
        <span>{{ option.name }}</span>
      </div>
    </div>

    <div
      class="flex flex-wrap w-full ml-3"
      v-else-if="product.variantMatrixSelect.size === 'DROPDOWN'"
    >
      <UDropdown
        :items="filteredProductVariant"
        :ui="{
          item: { disabled: 'cursor-text select-text w-full' },
          width: '100%',
        }"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="white"
          :label="selectedSize ? selectedSize.name : 'Options'"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />

        <template #item="{ item }">
          <span @click="logOptionSize(item)" class="cursor-pointer">
            {{ item.name }}
          </span>
        </template>
      </UDropdown>
    </div>

    <div class="flex flex-wrap" v-else>
      <div
        v-for="option in product.variants"
        :key="option?.name"
        @click="logOptionSize(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options transition duration-500 cursor-pointer"
        :class="selectedSize === option ? 'selected' : ''"
      >
        {{ option.name }}
      </div>
    </div>
  </div>
  <div v-else>
    <div
      class="flex flex-wrap w-full ml-3 gap-3"
      v-if="product.variantMatrixSelect.size === 'TABS'"
    >
      <div
        v-for="option in product.variantMatrix[product.variantTypes[0]]"
        :key="option"
        @click="logOptionSize(option)"
        class="px-4 mb-2 p-2 options cursor-pointer border-2 border-black flex gap-3 rounded items-center"
        :class="selectedSize === option ? 'border border-black bg-white' : ''"
      >
        <img :src="variantImage[option]?.[0]" class="rounded h-7 w-fit" />
        {{ option }}
      </div>
    </div>

    <div
      class="flex flex-wrap"
      v-else-if="product.variantMatrixSelect.size === 'PILLS'"
    >
      <div
        v-for="option in product.variantMatrix[product.variantTypes[0]]"
        :key="option"
        @click="logOptionSize(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options border-2 cursor-pointer flex items-center gap-2"
        :class="selectedSize === option ? 'border border-black bg-white' : ''"
      >
        <p
          class="rounded-full w-5 h-5 inline-block"
          :style="{
            backgroundColor: variantColor[option] || 'gray',
          }"
        ></p>
        <span>{{ option }}</span>
      </div>
    </div>

    <div
      class="flex flex-wrap w-full ml-3"
      v-else-if="product.variantMatrixSelect.size === 'DROPDOWN'"
    >
      <UDropdown
        :items="filteredProductVariant"
        :ui="{
          item: { disabled: 'cursor-text select-text w-full' },
          width: '100%',
        }"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="white"
          :label="selectedSize ? selectedSize.name : 'Options'"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />

        <template #item="{ item }">
          <span @click="logOptionSize(item)" class="cursor-pointer">
            {{ item.name }}
          </span>
        </template>
      </UDropdown>
    </div>

    <div class="flex flex-wrap" v-else>
      <div
        v-for="option in product.variantMatrix[product.variantTypes[0]]"
        :key="option"
        @click="logOptionSize(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options transition duration-500 cursor-pointer"
        :class="selectedSize === option ? 'selected' : ''"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  variantImage: {
    type: Object,
    default: () => ({}),
  },
  variantColor: {
    type: Object,
    default: () => ({}),
  },
  selectedSize: {
    type: String,
    default: () => null,
  },
  isContainSize: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:selectedSize"]);

const logOptionSize = (option) => {
  emit("update:selectedSize", option);
};
</script>
