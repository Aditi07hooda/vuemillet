<script setup>
import { ref } from "vue"
import { calculateDiscount } from '../composables/discount'
import { capitalize } from '../composables/capitalize'
import { containsOnlySize } from '../composables/containsOnlySize'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const selectedSize = ref(
    containsOnlySize(props.product.variantTypes) ?
        props.product.variants?.[0] :
        props.product.variantMatrix?.Size?.[0] ||
        props.product.variantMatrix?.size?.[0] ||
        props.product.variantMatrix?.SIZE?.[0])

const selectedVariant = ref(
    props.product.variantMatrix?.Millet?.[0] ||
    props.product.variantMatrix?.Variant?.[0] ||
    props.product.variantMatrix?.flavour?.[0] ||
    props.product.variantMatrix?.Texture?.[0] ||
    props.product.variantMatrix?.texture?.[0] ||
    props.product.variantMatrix?.Sweetner?.[0] ||
    props.product.variantMatrix?.Packing?.[0] ||
    props.product.variantMatrix?.packing?.[0] ||
    props.product.variantMatrix?.package?.[0] ||
    props.product.variantMatrix?.Package?.[0] ||
    props.product.variantMatrix?.Pack?.[0]
)

const selectedOption = computed(() => {
    return props.product.variants.find(x =>
        (x.matrix.Millet === selectedVariant.value ||
            x.matrix.Texture === selectedVariant.value ||
            x.matrix.texture === selectedVariant.value ||
            x.matrix.Sweetner === selectedVariant.value ||
            x.matrix.Packing === selectedVariant.value ||
            x.matrix.packing === selectedVariant.value ||
            x.matrix.package === selectedVariant.value ||
            x.matrix.Package === selectedVariant.value ||
            x.matrix.Pack === selectedVariant.value ||
            x.matrix.Variant === selectedVariant.value) &&
        (x.matrix.Size === selectedSize.value ||
            x.matrix.size === selectedSize.value ||
            x.matrix.SIZE === selectedSize.value)
    )
})

const logOption = () => {
    console.log("Selected size:", selectedSize.value)
    console.log("Selected variant", selectedVariant.value)
    console.log("select option comp", selectedOption.value)
}

</script>

<template>
    <NuxtLink :to="`/product/${product.id}`">
        <div class="product-image-container">
            <img :src="product.oneImg || product.images[0] || '/favicon.ico'" alt="Product Image"
                class="product-image" />
        </div>
        <div class="product-name">{{ capitalize(product.name) }}</div>
    </NuxtLink>
    <div v-if="containsOnlySize(product.variantTypes)">
        <div class="mb-2">Select Size</div>
        <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
            <option v-for="option in product.variants" :value="option">
                {{ option.name }}
            </option>
        </select>
    </div>
    <div v-else>
        <div class="mb-2">Select {{ capitalize(product?.variantTypes[0]) }}</div>
        <select class="mb-2 dropdown" v-model="selectedSize" @change="logOption">
            <option v-for="option in product.variantMatrix[product.variantTypes[0]]" :value="option">
                {{ option }}
            </option>
        </select>
        <div class="mb-2">Select {{ capitalize(product.variantTypes[1]) }}</div>
        <select class="mb-2 dropdown" v-model="selectedVariant" @change="logOption">
            <option v-for="option in product.variantMatrix[product.variantTypes[1]]" :value="option">
                {{ capitalize(option) }}
            </option>
        </select>
    </div>
    <div class="font-bold mb-2">
        <div v-if="containsOnlySize(product.variantTypes)">
            <div class="text-rose-600">{{ calculateDiscount(selectedSize.price, selectedSize.offerPrice)
                }} %
                off</div>
            <span class="line-through">₹ {{ selectedSize.price }}</span> <span class="text-green-600"> ₹
                {{ selectedSize.offerPrice }}</span>
        </div>
        <div v-else>
            <div class="text-rose-600">{{ calculateDiscount(selectedOption?.price, selectedOption?.offerPrice) }} %
                off
            </div>
            <span class="line-through">₹ {{ selectedOption?.price }}</span> <span class="text-green-600"> ₹
                {{ selectedOption?.offerPrice }}</span>
        </div>
    </div>
    <div>
        <button class="bg-pink-400 text-white hover:bg-green-400 transition duration-500 w-full py-2 rounded-3xl">
            Add
            to cart
        </button>
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
