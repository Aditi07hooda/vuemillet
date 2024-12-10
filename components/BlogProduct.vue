<script setup>
defineProps({
    products: {
        type: Array,
        required: true,
        default: () => [],
    },
});
const selectedSize = ref('')
const selectedMillet = ref('')

const logOption = () => {
    console.log("Selected size:", selectedSize.value);
    console.log("Selected millet:", selectedMillet.value);

};
</script>

<template>
    <div v-for="product in products" :key="product.slug" class="product-container rounded mb-10">
        <div class="product-image-container">
            <img :src="product.oneImg" alt="Product Image" class="product-image" />
        </div>
        <div class="product-name">{{ product.name }}</div>
        <div>
            <div class="mb-2">Select Size</div>
            <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
                <option v-for="(option) in product.variantMatrix.Size">
                    {{
                        option }}
                </option>
            </select>
            <div class="mb-2">Select Millet</div>
            <select class="mb-2 dropdown" v-model="selectedMillet" @change="logOption">
                <option v-for="(option) in product.variants" :value="option">
                    {{
                        option.name }}
                </option>
            </select>
            <div class="font-bold">
                <div class="text-rose-600">25 % off</div>
                <div>
                    <span class="line-through">₹ {{ selectedMillet?.price }}</span> <span class="text-green-600"> ₹
                        {{ selectedMillet?.offerPrice }}</span>
                </div>
            </div>
            <div>
                <button class="bg-pink-400 text-white  hover:bg-green-400 transition duration-500 p-2 rounded-3xl"> Add
                    to cart
                </button>
            </div>
        </div>
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

.dropdown {
    width: 200px;
    /* Fixed width for both dropdowns */
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #333;
    appearance: none;
    /* Remove default browser styles */
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    /* Custom arrow */
    background-repeat: no-repeat;
    background-position: right 10px center;
}

/* Dropdown hover and focus styles */
.dropdown:hover,
.dropdown:focus {
    border-color: #007bff;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Dropdown option styling */
.dropdown option {
    padding: 10px;
    font-size: 16px;
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
