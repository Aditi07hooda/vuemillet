<script setup>
import { ref } from "vue"

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

function containsOnlySize(array) {
    return array.every(entry => entry === 'size' || entry === 'Size')
}

const selectedSize = ref(containsOnlySize(props.product.variantTypes) ? props.product.variants?.[0] : props.product.variantMatrix?.Size?.[0])
const selectedMillet = ref(props.product.variants?.[0])

const logOption = () => {
    console.log("Selected size:", selectedSize.value)
    console.log("Selected millet:", selectedMillet.value)
}

</script>

<template>
    <div class="product-image-container">
        <img :src="product.oneImg" alt="Product Image" class="product-image" />
    </div>
    <div class="product-name">{{ product.name }}</div>
    <div>
        <div v-if="containsOnlySize(product.variantTypes)">
            <div class="mb-2">Select Size</div>
            <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
                <option v-for="option in product.variants" :value="option">
                    {{ option.name }}
                </option>
            </select>
        </div>
        <div v-if="product.variantTypes.includes('Millet')">
            <div class="mb-2">Select Size</div>
            <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
                <option v-for="option in product.variantMatrix.Size" :value="option">
                    {{ option }}
                </option>
            </select>
            <div class="mb-2">Select Millet</div>
            <select class="mb-2 dropdown" v-model="selectedMillet" @change="logOption">
                <option v-for="option in product.variants" :value="option">
                    {{ option.name }}
                </option>
            </select>
        </div>
        <div class="font-bold mb-2">
            <div class="text-rose-600">25 % off</div>
            <div v-if="containsOnlySize(product.variantTypes)">
                <span class="line-through">₹ {{ selectedSize?.price }}</span> <span class="text-green-600"> ₹
                    {{ selectedSize?.offerPrice }}</span>
            </div>
            <div v-if="product.variantTypes.includes('Millet')">
                <span class="line-through">₹ {{ selectedMillet?.price }}</span> <span class="text-green-600"> ₹
                    {{ selectedMillet?.offerPrice }}</span>
            </div>
        </div>
        <div>
            <button class="bg-pink-400 text-white hover:bg-green-400 transition duration-500 p-2 rounded-3xl"> Add
                to cart
            </button>
        </div>
    </div>
</template>

<style scoped>
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
    width: 100%;
    max-width: 200px;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #333;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
}

.dropdown:hover,
.dropdown:focus {
    border-color: #007bff;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.dropdown option {
    padding: 10px;
    font-size: 16px;
}

@media (max-width: 768px) {
    .product-container {
        flex: 1 1 calc(50% - 10px);
        /* Two items per row */
    }

    .dropdown {
        width: 100%;
        max-width: unset;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .product-container {
        flex: 1 1 100%;
        /* One item per row */
    }

    .dropdown {
        width: 100%;
        font-size: 12px;
    }
}
</style>
