<script setup></script>
<template>
  <div class="flex items-center justify-center my-44">
    <div class="bg-green-200 p-6 rounded-lg shadow-md text-center">
      <h2 class="text-2xl font-semibold mb-4">
        Please Login to Access This Feature
      </h2>
      <p class="text-gray-600 mb-6">
        You need to be logged in to view this content.
      </p>
      <nuxt-link to="/account/login">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-pink-400 transition"
        >
          Go to Login Page
        </button>
      </nuxt-link>
    </div>
  </div>
</template>
