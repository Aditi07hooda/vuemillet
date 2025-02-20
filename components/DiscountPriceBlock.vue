<script setup>
defineProps({
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  style: { type: String },
});

const hasDiscount = (price, offerPrice) => price > offerPrice;
</script>

<template>
  <div class="flex items-center gap-3 justify-center">
    <template v-if="hasDiscount(price, offerPrice)">
      <span class="text-gray-500 text-2xl line-through">Rs. {{ price }}</span>
      <span class="text-green-600 text-3xl font-bold"
        >Rs. {{ offerPrice }}</span
      >
      <span class="text-rose-600 text-2xl font-semibold">
        ({{ calculateDiscount(price, offerPrice) }}% off)
      </span>
    </template>
    <template v-else>
      <span class="text-green-600 text-3xl font-bold"
        >Rs. {{ offerPrice }}</span
      >
    </template>
  </div>
</template>
