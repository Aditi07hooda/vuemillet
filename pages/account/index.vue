<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { fetchUserData, fetchUserAddressData } from "~/composables/user";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;

const user = ref("");
const userData = ref({ profile: {}, address: {} });
const sessionId = ref("");

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
      userData.value.address = userAddress;

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
</script>

<template>
  <div v-if="sessionId === ''">
    <p>Loading...</p>
  </div>

  <div v-else-if="user !== ''">
    <h1>Welcome back!!</h1>
    <p>User data:</p>
    <pre>{{ userData }}</pre>
    <button>Logout</button>
  </div>

  <div v-else>user doesnot exist. Please signin into your account.</div>
</template>
