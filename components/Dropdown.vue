<template>
  <div class="relative w-full">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex justify-between items-center shadow-sm"
    >
      {{ selectedValue }}
      <span class="ml-2 text-gray-500">&#9662;</span>
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

const isDropdownOpen = ref(false);
const dropdown = ref(null);

const props = defineProps({
  selectedSize: [Object, String],
  selectedVariant: String,
  filteredProductVariant: Array,
});

const emit = defineEmits(["update:selectedSize", "update:selectedVariant"]);

// Compute the displayed value in the dropdown button
const selectedValue = computed(() => {
  if (props.selectedSize && props.selectedSize.name)
    return props.selectedSize.name;
  if (props.selectedVariant) return props.selectedVariant;
  return "Options"; // Default label when nothing is selected
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  console.log("dropdown open value - ", isDropdownOpen.value);
};

const logOption = (item) => {
  if (typeof item === "string") {
    emit("update:selectedVariant", item);
  } else {
    emit("update:selectedSize", item);
  }
  isDropdownOpen.value = false;
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
