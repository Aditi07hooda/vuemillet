<script setup>
defineProps({
  click: {
    type: Function,
    required: true,
  },
});
</script>
<template>
  <div
    className="flex flex-col items-center justify-center py-6 px-6 text-center"
  >
    <div className="relative w-full max-w-md mb-6 lg:h-80 h-64">
      <img alt="404" src="/public/404.png" />
    </div>
    <h1
      className="text-5xl text-gray-500 font-thin items-start tracking-widest"
    >
      SORRY!!
    </h1>
    <h1 className="text-4xl font-bold text-gray-800 mb-4">
      This page is gone.
    </h1>
    <p className="text-gray-600 mb-8">
      ...maybe the page you are looking for is not found or never existed.
    </p>
    <button
      @click="click"
      class="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded hover:bg-pink-400"
    >
      Go Back
    </button>
  </div>
</template>
