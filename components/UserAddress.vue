<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { FilePenLine } from "lucide-vue-next";

const addressForm = reactive({
  id: null,
  person: "",
  email: "",
  mobile: "",
  door: "",
  apartment: "",
  landmark: "",
  city: "",
  pinCode: "",
  address: "",
});

const userData = ref({ profile: {}, address: [] });
const personData = reactive({ person: {} });
const existingAddress = ref([]);
const isLoading = ref(false);

const isSaveBtnDisabled = computed(
  () => !Object.values(addressForm).every((field) => field !== "")
);

const addressFields = [
  "person",
  "email",
  "mobile",
  "door",
  "apartment",
  "address",
  "landmark",
  "city",
  "pinCode",
];

const fetchAddress = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch("/api/address", {
      headers: { session: localStorage.getItem("sessionId") },
    });
    existingAddress.value = data.value;
  } catch (error) {
    console.error("Error fetching address:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  if (addressForm.id) {
    await updateAddress(addressForm.id);
  } else {
    await saveAddress();
  }
};

const saveAddress = async () => {
  try {
    const response = await useFetch("/api/address", {
      method: "POST",
      headers: { session: localStorage.getItem("sessionId") },
      body: addressForm,
    });
    existingAddress.value.push(response.data.value);
    resetForm();
    fetchAddress();
  } catch (error) {
    console.error("Error saving address:", error);
  } finally {
    isLoading.value = false;
  }
};

const updateAddress = async (addressId) => {
  try {
    await useFetch(`/api/address?id=${addressId}`, {
      method: "PUT",
      headers: { session: localStorage.getItem("sessionId") },
      body: addressForm,
    });

    fetchAddress();
    resetForm();
  } catch (error) {
    console.error("Error updating address:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.keys(addressForm).forEach((key) => (addressForm[key] = ""));
  addressForm.person = personData.person.name;
  addressForm.email = personData.person.email;
  addressForm.mobile = personData.person.mobile;
};

onMounted(async () => {
  await fetchAddress();
  const meResponse = await useFetch("/api/me", {
    headers: { session: localStorage.getItem("sessionId") },
  });
  personData.person = meResponse.data.value;
  addressForm.email = meResponse.data.value.email;
  addressForm.person = meResponse.data.value.name;
  addressForm.mobile = meResponse.data.value.mobile;
});

const handleEditClick = (addressId) => {
  const addressToEdit = existingAddress.value.find((addr) => addr.id === addressId);
  if (addressToEdit) {
    Object.assign(addressForm, addressToEdit);
  }
};
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center">
    <h1>Loading ...</h1>
  </div>

  <div class="flex flex-col lg:flex-row lg:justify-between gap-8 py-6" v-else>
    <!-- Existing Addresses -->
    <div class="w-full lg:w-1/2">
      <h2 class="text-xl font-semibold mb-4">Existing Addresses</h2>
      <div class="flex flex-col gap-4">
        <div v-if="existingAddress.length === 0" class="text-gray-500">
          No addresses found.
        </div>
        <div
          v-else
          v-for="(address, index) in existingAddress"
          :key="index"
          class="border p-4 rounded-lg bg-gray-50 shadow-md cursor-pointer"
          :class="{ 'border-green-500': addressForm.id === address.id }"
          @click="handleEditClick(address.id)"
        >
          <p class="text-gray-700 font-bold capitalize">{{ address.person }}</p>
          <p
            class="text-gray-600 flex flex-wrap gap-2 align-middle font-semibold"
          >
            {{ address.mobile }}
          </p>
          <p class="text-gray-600">
            {{ address.door }}, {{ address.address }} {{ address.apartment }},
            {{ address.landmark }}
          </p>
          <p class="text-gray-600">
            {{ address.city }}, {{ address.state }}, {{ address.pinCode }}
          </p>
          <FilePenLine
            size="20"
            class="flex self-end justify-self-end text-gray-500 hover:text-green-600"
            @click="handleEditClick(address.id)"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit Address -->
    <div class="w-full lg:w-1/2">
      <h2 class="text-xl font-semibold mb-4">
        {{ addressForm.id ? "Edit Address" : "Add New Address" }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-for="field in addressFields" :key="field" class="flex flex-col">
          <label class="text-gray-700 capitalize"
            >{{ field }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="addressForm[field]"
            type="text"
            :name="field"
            class="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div class="flex justify-between gap-5">
          <button
            :disabled="isSaveBtnDisabled"
            type="submit"
            class="py-2 px-4 w-full bg-green-500 text-white rounded-md hover:bg-indigo-600"
          >
            {{ addressForm.id ? "Update Address" : "Save Address" }}
          </button>
          <button
            @click="resetForm"
            type="button"
            class="py-2 px-4 w-full text-gray-600 rounded-md hover:text-gray-800 bg-blue-100"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
