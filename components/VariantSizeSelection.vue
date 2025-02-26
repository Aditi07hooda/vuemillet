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
        class="px-4 mb-2 p-2 cursor-pointer border flex gap-3 rounded items-center"
        :class="
          props.selectedSize.name === option.name
            ? 'border-2 border-black bg-white'
            : ''
        "
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
        class="rounded-full px-2 mx-2 mb-2 p-2 border cursor-pointer flex items-center gap-2"
        :class="
          props.selectedSize.name === option.name
            ? 'border-2 border-black bg-white'
            : ''
        "
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
          :label="props.selectedSize ? props.selectedSize.name : 'options'"
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
        class="rounded-full px-2 mx-2 mb-2 p-2 border transition duration-500 cursor-pointer"
        :class="
          props.selectedSize.name === option.name
            ? 'border-2 border-black bg-white'
            : ''
        "
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
        class="px-4 mb-2 p-2 cursor-pointer border flex gap-3 rounded items-center"
        :class="
          props.selectedSize.name === option
            ? 'border-2 border-black bg-white'
            : ''
        "
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
        class="rounded-full px-2 mx-2 mb-2 p-2 border cursor-pointer flex items-center gap-2"
        :class="
          props.selectedSize.name === option
            ? 'border-2 border-black bg-white'
            : ''
        "
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
          :label="props.selectedSize ? props.selectedSize.name : 'Options'"
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
        class="rounded-full px-2 mx-2 mb-2 p-2 border transition duration-500 cursor-pointer"
        :class="
          props.selectedSize.name === option
            ? 'border-2 border-black bg-white'
            : ''
        "
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

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

const filteredProductVariant = computed(() => {
  return product.value.variants;
});

const logOptionSize = (option) => {
  emit("update:selectedSize", option);
};
</script>

<style scoped>
.options {
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
}
</style>
