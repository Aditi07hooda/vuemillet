<script setup>

import MADE_TO_ORDER from '@/assets/images/MADE_TO_ORDER.PNG'
import NO_PRESERVATIVES from '@/assets/images/NO_PRESERVATIVES.PNG'
import ORGANIC from '@/assets/images/ORGANIC.PNG'

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID
const route = useRoute()
const { data: product, error, loading } = await useFetch(`${baseURL}/store/${brandID}/products/${route.params.slug}`)

const mainImg = ref(product.value.oneImg)

const changeMainImage = (src) => {
    mainImg.value = src
}

const capitalize = (str) => {
    return str
        .toLowerCase()
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}

const getSrcFromTags = (tag) => {
    switch (tag.toLowerCase()) {
        case 'made_to_order':
            return MADE_TO_ORDER
        case 'no_preservatives':
            return NO_PRESERVATIVES
        case 'organic':
            return ORGANIC
        default:
            return null
    }
}

const selectedSize = ref(
    containsOnlySize(product.value.variantTypes) ?
        product.value.variants?.[0] :
        product.value.variantMatrix?.Size?.[0] ||
        product.value.variantMatrix?.size?.[0] ||
        product.value.variantMatrix?.SIZE?.[0])

const selectedVariant = ref(
    product.value.variantMatrix?.Millet?.[0] ||
    product.value.variantMatrix?.Variant?.[0] ||
    product.value.variantMatrix?.flavour?.[0] ||
    product.value.variantMatrix?.Texture?.[0] ||
    product.value.variantMatrix?.texture?.[0] ||
    product.value.variantMatrix?.Sweetner?.[0] ||
    product.value.variantMatrix?.Packing?.[0] ||
    product.value.variantMatrix?.packing?.[0] ||
    product.value.variantMatrix?.package?.[0] ||
    product.value.variantMatrix?.Package?.[0] ||
    product.value.variantMatrix?.Pack?.[0]
)

function containsOnlySize(array) {
    return array.every(entry => entry.toLowerCase() === 'size')
}

const selectedOption = computed(() => {
    return product.value.variants.find(x =>
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

console.log("data of each product", product.value)

</script>
<template>
    <!-- ingredients <div v-for="ingredient in product.ingredients">{{ ingredient}}</div>
    printDescription <div v-html="product.printDescription"></div>
    <video v-for="video in product.videos" :src="video"></video>
       -->
    <div class="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg shadow-md p-6 gap-6 max-w-4xl mx-auto">
        <div class="w-full md:w-1/3">
            <img :src="mainImg" alt="Product Image" class="w-full h-auto rounded-lg object-cover" />
            <div class="flex">
                <div v-for="image in product.images" class="group-image">
                    <img :src="image" :alt="image" width="100px" class="rounded-lg" @click="changeMainImage(image)" />
                </div>
            </div>
        </div>
        <div class="w-full md:w-2/3 flex flex-col justify-center text-center md:text-left">
            <h2 class="custom-underline text-2xl font-semibold text-gray-800 mb-2 text-center">
                {{ product.webName }}
            </h2>
            <div class="flex justify-evenly">
                <div v-for="tag in product.tags" :key="tag" class="text-gray-800 flex flex-col justify-center">
                    <div class="flex justify-center items-center">
                        <img :src="getSrcFromTags(tag)" :alt="tag" width="70px" />
                    </div>
                    <div> {{ capitalize(tag) }} </div>
                </div>
            </div>
            <div v-if="containsOnlySize(product.variantTypes)" class="text-gray-800">
                <div class="flex border border-pink-600">
                    <div class="mb-2">Size</div>
                    <div class="flex flex-wrap border border-green-600">
                        <div v-for="option in product.variants" :value="option"
                            class="rounded-full border border-cyan-600 px-2 mx-2 mb-2">
                            {{ option.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-800">
                <div class="flex border border-pink-600">
                    <div class="mb-2 border border-red-600">{{ capitalize(product?.variantTypes[0]) }}</div>
                    <div class="flex flex-wrap border border-green-600">
                        <div v-for="option in product.variantMatrix[product.variantTypes[0]]" :key="option"
                            class="rounded-full border border-cyan-600 px-2 mx-2 mb-2">{{ option }}
                        </div>
                    </div>
                </div>
                <div class="flex border border-black-600">
                    <div class="mb-2 border border-orange-600">{{ capitalize(product.variantTypes[1]) }}</div>
                    <div class="flex flex-wrap border border-purple-600">
                        <div v-for="option in product.variantMatrix[product.variantTypes[1]]" :key="option"
                            class="rounded-full border border-cyan-600 px-2 mx-2 mb-2">
                            {{ option }}
                        </div>
                    </div>
                </div>
            </div>
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                Buy Now
            </button>
        </div>
    </div>
    <div>
        <p class="text-gray-600 mb-4" v-html="product.description"> </p>
    </div>
</template>

<style scoped>
.custom-underline {
    font-size: 2.5em;
    padding-bottom: 1em;
    background-position: bottom;
    background-repeat: no-repeat;
    background-image: url('@/assets/images/underline.svg');
}
</style>