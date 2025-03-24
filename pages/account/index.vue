<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { fetchUserData, fetchUserAddressData } from "~/composables/user";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const router = useRouter();

const user = ref("");
const userData = ref({ profile: {} });
const sessionId = ref("");

const AccountTabs = ref("Profile");

const availableTabs = ref([
  {
    label: "Profile",
    value: "Profile",
  },
  {
    label: "Address",
    value: "Address",
  },
  {
    label: "Orders",
    value: "Orders",
  },
]);

onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      sessionId.value = window.localStorage.getItem("sessionId");
      user.value = window.localStorage.getItem("user");
      //   console.log(
      //     "Session ID and user in account:",
      //     sessionId.value,
      //     user.value
      //   );
    }

    if (sessionId.value) {
      const userProfile = await fetchUserData(
        base_url,
        brand_id,
        sessionId.value
      );
      const userAddress = await fetchUserAddressData(
        base_url,
        brand_id,
        sessionId.value
      );

      localStorage.setItem(
        "userData",
        JSON.stringify({ profile: userProfile, address: userAddress })
      );

      userData.value.profile = userProfile;

      //   console.log(
      //     "User data fetched and stored in local storage:",
      //     userData.value.address,
      //     userData.value.profile
      //   );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

const logout = async() => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
  }
  user.value = "";
  userData.value = { profile: {} };

  sessionId.value = await createSessionId(base_url, brand_id);
  localStorage.setItem("sessionId", sessionId.value);
  router.push("/account/login");
};
</script>

<template>
  <div v-if="sessionId === ''">
    <p>Loading...</p>
  </div>

  <div v-if="user === null">
    <UserNotFound />
  </div>

  <div v-else-if="user !== ''">
    <div class="w-full px-6 bg-white rounded-lg py-8 my-2">
      <h2 class="text-2xl font-semibold text-center mb-6">My Account</h2>

      <div
        class="flex gap-5 border-2 justify-around mb-2 bg-secondary bg-opacity-45 lg:w-1/2 lg:justify-self-center"
      >
        <div
          class="flex flex-row mb-2 bg-secondary bg-opacity-45"
          v-for="tab in availableTabs"
          :key="tab.value"
        >
          <div
            :class="{
              'max-w-md hover:underline hover:underline-offset-8 hover:decoration-primary active:underline active:underline-offset-8 active:decoration-primary p-2 cursor-pointer transition-colors duration-300 transform': true,
              'text-primary': AccountTabs === tab.value,
            }"
            @click="AccountTabs = tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>

      <div v-if="AccountTabs === 'Profile'" class="w-full lg:flex lg:justify-center">
        <form class="lg:justify-center lg:flex lg:w-1/2 lg:flex-col">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              v-model="userData.profile.name"
              class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Phone</label>
            <input
              type="text"
              name="mobile"
              v-model="userData.profile.mobile"
              class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              v-model="userData.profile.email"
              class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Save Profile
          </button>
          <button
            type="submit"
            @click="logout"
            class="w-full bg-blue-100 text-black mt-3 py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Logout
          </button>
        </form>
      </div>

      <div v-else-if="AccountTabs === 'Address'">
        <UserAddress />
      </div>

      <div v-else-if="AccountTabs === 'Orders'">
        <Orders />
      </div>
    </div>
  </div>

  <div v-else>
    <p>User does not exist. Please sign in to your account.</p>
  </div>
</template>