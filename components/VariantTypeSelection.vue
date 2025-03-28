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
        class="px-4 mb-2 p-2 options cursor-pointer border transition duration-500 flex flex-col gap-3 rounded items-center"
        :class="{
          'border-2 border-black bg-white': props.selectedVariant === option,
        }"
      >
        <NuxtImg
          provider="imgix"
          class="rounded h-20 w-fit"
          loading="lazy"
          format="webp"
          :src="
            variantImage?.[option]?.[0]?.startsWith('http')
              ? variantImage?.[option]?.[0]?.replace(/^https?:\/\//, '')
              : variantImage?.[option]?.[0]
          "
          sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
        />
        {{ option }}
      </div>
    </div>

    <!-- PILLS View -->
    <div class="flex flex-wrap" v-else-if="variantStyle === 'PILLS'">
      <div
        v-for="option in product.variantMatrix[product.variantTypes[1]]"
        :key="option"
        @click="logOptionVariant(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options transition duration-500 border cursor-pointer flex items-center gap-2"
        :class="{
          'border-2 border-black bg-white': props.selectedVariant === option,
        }"
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
      <Dropdown
        :selectedVariant="selectedVariant"
        :filteredProductVariant="filteredProductVariant"
        @update:selectedVariant="logOptionVariant"
        :is-variant="true"
      />
    </div>

    <!-- Default Variant View -->
    <div class="flex flex-wrap" v-else>
      <div
        v-for="option in product.variantMatrix[product.variantTypes[1]]"
        :key="optional"
        @click="logOptionVariant(option)"
        class="rounded-full px-2 mx-2 mb-2 p-2 options border transition duration-500 cursor-pointer"
        :class="{
          'border-2 border-black bg-white': props.selectedVariant === option,
        }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
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
