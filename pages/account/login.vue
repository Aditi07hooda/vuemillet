<script setup>
import { z } from "zod";
import { useRouter } from "vue-router";

const config = useRuntimeConfig();
const base_url = config.public.baseURL;
const brand_id = config.public.brandID;
const router = useRouter();

const sessionId = ref(null);
const buttonText = ref("Send OTP");

if (typeof window !== "undefined") {
  sessionId.value = window.localStorage.getItem("sessionId");
  console.log("Session ID in login:", sessionId.value);
}

const schema = z.object({
  contactNumber: z.number().min(10, "Must be at least 10 digits"),
  otp: z.number().min(4, "Must be a 4 digits otp"),
});

const state = reactive({
  contactNumber: undefined,
  otp: undefined,
  sendOtpClicked: false,
  otpSent: false,
  otpValidation: false,
});

const sendOtp = async () => {
  const {
    data: otp,
    error: otpError,
    loading: otpLoading,
  } = await useFetch(`${base_url}/store/${brand_id}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      session: sessionId.value,
    },
    body: new URLSearchParams({
      mobile: state.contactNumber,
    }),
  });

  console.log("OTP received:", otp.value);
  state.otpSent = otp.value.loginStatus === 'OTP' ? true : false;
};

const validateOtp = async () => {
  const {
    data: validateOtp,
    error: validateOtpError,
    loading: validateOtpLoading,
  } = await useFetch(`${base_url}/store/${brand_id}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Bearer ${sessionId.value}`,
      session: sessionId.value,
    },
    body: new URLSearchParams({
      mobile: state.contactNumber,
      otp: state.otp,
      action: "OTP",
    }),
  });

  console.log("OTP validated:", validateOtp.value);
  state.otpValidation = validateOtp.value.valid;
  if (state.otpValidation) {
    localStorage.setItem("sessionId", validateOtp.value.session);
    localStorage.setItem("user", validateOtp.value.user);
    router.push("/account");
  }
};

const handleSendOtpState = () => {
  state.sendOtpClicked = true;
  buttonText.value = "Validate OTP";
  sendOtp();
};

const toggleOtp = () => {
    state.sendOtpClicked ? validateOtp() : handleSendOtpState();
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="px-8 space-y-5 my-8">
      <h1 class="text-2xl font-bold text-center">SignIn / SignUp</h1>
      <p class="text-base font-medium text-center">
        Please enter your phone number to view your account.
      </p>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 mt-10 !important"
      >
        <UFormGroup label="contactNumber" name="contactNumber">
          <UInput v-model="state.contactNumber" type="number" />
        </UFormGroup>

        <UFormGroup label="otp" name="otp" v-if="state.sendOtpClicked === true">
          <UInput v-model="state.otp" type="number" />
        </UFormGroup>

        <p class="text-sm font-light text-center">
          By signing in, you agree to our
          <NuxtLink to="/privacy">
            <u class="font-normal">privacy policy</u>
          </NuxtLink>
          and
          <NuxtLink to="/terms">
            <u class="font-normal">terms of services</u> </NuxtLink
          >.
        </p>

        <UButton
          type="submit"
          class="w-full text-center flex justify-center text-lg"
          @click="toggleOtp"
        >
          {{ buttonText }}
        </UButton>
      </UForm>
    </div>
  </div>
</template>
