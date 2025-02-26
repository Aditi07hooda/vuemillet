<template>
  <div>
    <!-- TABS View -->
    <div
      class="flex flex-wrap w-full ml-3 gap-3"
      v-if="variantStyle === 'TABS'"
    >
      <div
        v-for="option in product.variantMatrix[product.variantTypes[1]]"
        :key="option"
        @click="logOptionVariant(option)"
        class="px-4 mb-2 p-2 options cursor-pointer border-2 border-black flex gap-3 rounded items-center"
        :class="{ 'border border-black bg-white': selectedVariant === option }"
      >
        <img :src="variantImage?.[option]?.[0]" class="rounded h-7 w-fit" />
        {{ option }}
      </div>
    </div>

    <!-- PILLS View -->
    <div class="flex flex-wrap" v-else-if="variantStyle === 'PILLS'">
      <div
        v-for="option in product.variantMatrix[product.variantTypes[1]]"
        :key="option"
        @click="logOptionVariant(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options border-2 cursor-pointer flex items-center gap-2"
        :class="{ 'border border-black bg-white': selectedVariant === option }"
      >
        <p
          class="rounded-full w-5 h-5 inline-block"
          :style="{ backgroundColor: variantColor?.[option] || 'gray' }"
        ></p>
        <span>{{ option }}</span>
      </div>
    </div>

    <!-- DROPDOWN View -->
    <div
      class="flex flex-wrap w-full ml-3"
      v-else-if="variantStyle === 'DROPDOWN'"
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
          :label="selectedVariant ? selectedVariant : 'Options'"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />

        <template #item="{ item }">
          <span @click="logOptionVariant(item)" class="cursor-pointer">
            {{ item.name }}
          </span>
        </template>
      </UDropdown>
    </div>

    <!-- Default Variant View -->
    <div class="flex flex-wrap" v-else>
      <div
        v-for="option in product.variantMatrix[product.variantTypes[1]]"
        :key="optional"
        @click="logOptionVariant(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options transition duration-500 cursor-pointer"
        :class="{ 'border border-black bg-white': selectedVariant === option }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { optional } from "zod";

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
  selectedVariant: {
    type: String,
    default: () => null,
  },
});

const emit = defineEmits(["update:selectedVariant"]);

const logOptionVariant = (option) => {
  emit("update:selectedVariant", option);
};

const variantStyle = computed(
  () => props.product?.variantMatrixSelect?.[props.product.variantTypes?.[1]]
);

// Watch for changes in selectedVariant
watch(
  () => props.selectedVariant,
  (newValue, oldValue) => {
    console.log("Variant updated from", oldValue, "to", newValue);
  }
);
</script>
