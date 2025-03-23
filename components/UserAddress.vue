<script setup>
import { ref, reactive, onMounted } from "vue";
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
const personData = reactive({
  person: {},
});
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

const config = useRuntimeConfig();
const baseUrl = config.public.baseURL;
const brandId = config.public.brandID;

const fetchAddress = async () => {
  isLoading.value = true;
  try {
    if (typeof window !== "undefined") {
      userData.value = JSON.parse(window.localStorage.getItem("userData"));
    }
    existingAddress.value = userData.value.address;
    console.log("Existing addresses:", existingAddress.value);
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
    const response = await $fetch(`${baseUrl}/store/${brandId}/auth/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session: localStorage.getItem("sessionId"),
      },
      body: JSON.stringify({
        name: addressForm.person,
        email: addressForm.email,
        phone: addressForm.mobile,
        door: addressForm.door,
        apartment: addressForm.apartment,
        address: addressForm.address,
        landmark: addressForm.landmark,
        city: addressForm.city,
        pincode: addressForm.pinCode,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save address");
    }

    const data = await response.json();
    existingAddress.value.push(addressForm);
    resetForm();
    fetchAddress();
    isLoading.value = false;
  } catch (error) {
    console.error("Error saving address:", error);
    isLoading.value = false;
  }
};

const updateAddress = async (addressId) => {
  try {
    const response = await $fetch(
      `${baseUrl}/store/${brandId}/auth/address/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          session: localStorage.getItem("sessionId"),
        },
        body: JSON.stringify(addressForm),
      }
    );
    // 79621ee9-ed0a-4fed-b5dd-cdb54cab71ec
    if (!response.ok) {
      throw new Error("Failed to update address");
    }

    const updatedAddress = await response.json();
    const index = existingAddress.value.findIndex(
      (addr) => addr.id === addressId
    );
    existingAddress.value[index] = updatedAddress;

    resetForm();
    isLoading.value = false;
  } catch (error) {
    console.error("Error updating address:", error);
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.keys(addressForm).forEach((key) => (addressForm[key] = ""));
  addressForm.person = personData.person.name;
  addressForm.email = personData.person.email;
  addressForm.mobile = personData.person.mobile;
  console.log("person data:", personData);
};

onMounted(async () => {
  await fetchAddress();
  const meResponse = await $fetch(`${baseUrl}/store/${brandId}/auth/me`, {
    headers: { session: localStorage.getItem("sessionId") },
  });
  const meData = await meResponse.json();
  console.log("Me data:", meData);
  personData.person = meData;
  addressForm.email = meData.email;
  addressForm.person = meData.name;
  addressForm.mobile = meData.mobile;
});

const handleEditClick = (addressId) => {
  const addressToEdit = existingAddress.value.find(
    (addr) => addr.id === addressId
  );
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
