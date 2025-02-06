<script setup>
defineProps({
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
});
</script>

<template>
  <template v-if="hasDiscount(price, offerPrice)">
    <div class="flex gap-5">
      <div class="text-rose-600">
        {{ calculateDiscount(price, offerPrice) }} % off
      </div>
      <span class="line-through me-1 text-gray-600">₹ {{ price }}</span>
    </div>
  </template>
  <span class="text-green-600">₹ {{ offerPrice }}</span>
</template>
