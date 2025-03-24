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
        class="px-4 mb-2 p-2 cursor-pointer border flex flex-col gap-3 rounded items-center"
        :class="
          props.selectedSize.name === option.name
            ? 'border-2 border-black bg-white'
            : ''
        "
        loading="lazy"
      >
        <NuxtImg
          provider="imgix"
          :src="
            variantImage[option.name]?.[0]?.startsWith('http')
              ? variantImage[option.name]?.[0]?.replace(/^https?:\/\//, '')
              : variantImage[option.name]?.[0]
          "
          class="rounded h-20 w-fit"
          format="webp"
          loading="lazy"
          sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
        />
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
      <Dropdown
        :selectedSize="selectedSize"
        :filteredProductVariant="filteredProductVariant"
        @update:selectedSize="selectedSize = $event"
        :log-size-function="logOptionSize"
      />
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
        class="px-4 mb-2 p-2 cursor-pointer border flex flex-col gap-3 rounded items-center"
        :class="
          props.selectedSize.name === option
            ? 'border-2 border-black bg-white'
            : ''
        "
      >
        <NuxtImg
          provider="imgix"
          :src="
            variantImage[option]?.[0]?.startsWith('http')
              ? variantImage[option]?.[0]?.replace(/^https?:\/\//, '')
              : variantImage[option]?.[0]
          "
          class="rounded h-20 w-fit"
          loading="lazy"
          format="webp"
          sizes="(max-width: 576px) 244px, (max-width: 767px) 244px, 244px"
        />
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
      <Dropdown
        :selectedSize="selectedSize"
        :filteredProductVariant="filteredProductVariant"
        @update:selectedSize="selectedSize = $event"
        :log-size-function="logOptionSize"
      />
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
  return props.product.variants;
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
