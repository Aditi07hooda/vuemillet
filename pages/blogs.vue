<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else>
            <div class="text-center my-4 p-5 mx-14">
                <h1 class="uppercase"> The Millet Store Academy </h1>
                <div>Your weekly dose of wellness wisdom every Thursday!
                </div>
            </div>
            <div class="flex flex-wrap flex-1 justify-evenly p-8">
                <Blog :blogs="data" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFetch } from "#app"

const config = useRuntimeConfig()
const baseURL = config.public.baseURL
const brandID = config.public.brandID

const { data, error,  loading } = await useFetch(`${baseURL}/store/${brandID}/blogs`)
</script>

<style>
h1 {
    color: #768451;
    font-size: 25px;
}
</style>