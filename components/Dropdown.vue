<template>
  <div class="relative w-full">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex justify-between items-center shadow-sm"
    >
      {{ selectedSize.name }}
      <LucideChevronDown class="w-6 h-6" />
      <!-- Downward arrow -->
    </button>

    <!-- Dropdown List -->
    <div
      v-show="isDropdownOpen"
      class="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50"
    >
      <div
        v-for="item in filteredProductVariant"
        :key="item.name || item"
        @click="logOption(item)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
      >
        {{ item.name || item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { boolean } from "zod";

const isDropdownOpen = ref(false);
const dropdown = ref(null);

const props = defineProps({
  selectedSize: String,
  selectedVariant: String,
  filteredProductVariant: Array,
  isVariant: boolean,
  logSizeFunction: Function,
});

const emit = defineEmits(["update:selectedSize", "update:selectedVariant"]);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  console.log("dropdown open value - ", isDropdownOpen.value);
};

const logOption = (item) => {
  if (props.isVariant) {
    emit("update:selectedVariant", item);
  } else {
    console.log("variant coming : ", item);
    if (typeof props.logSizeFunction === "function") {
      props.logSizeFunction(item);
    } else {
      console.error("logSizeFunction is not a function", props.logSizeFunction);
    }
  }
  isDropdownOpen.value = false;
  console.log("variant selected - ", props.selectedSize);
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
