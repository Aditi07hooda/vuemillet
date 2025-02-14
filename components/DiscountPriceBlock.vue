<script setup>
defineProps({
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  style: { type: String },
});
</script>

<template>
  <template v-if="hasDiscount(price, offerPrice)">
    <div class="flex gap-5 justify-center items-center">
      <div class="text-rose-600">
        {{ calculateDiscount(price, offerPrice) }} % off
      </div>
      <span class="line-through me-1 text-gray-600">₹ {{ price }}</span>
    </div>
  </template>
  <span :style="style" class="text-green-600 text-xl font-bold">₹ {{ offerPrice }}</span>
</template>
