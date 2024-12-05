<script setup>
defineProps({
    products: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>

<template>
    <div v-for="product in products" :key="product.slug" class="product-container rounded mb-10">
        <div class="product-image-container">
            <img :src="product.oneImg" alt="Product Image" class="product-image" />
        </div>
        <div class="product-name">{{ product.name }}</div>
    </div>
</template>

<style scoped>
.product-container {
    flex: 1 1 calc(25% - 10px);
    max-width: 250px;
    text-align: center;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-image-container {
    width: 100%;
    padding-top: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-name {
    margin-top: 10px;
    font-size: 20px;
}

@media (max-width: 768px) {
    .product-container {
        flex: 1 1 calc(50% - 10px);
        /* Two items per row */
    }
}

@media (max-width: 480px) {
    .product-container {
        flex: 1 1 100%;
        /* One item per row */
    }
}
</style>
