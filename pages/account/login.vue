<script setup>
import { z } from "zod";
import { useRouter } from "vue-router";
import { sendOtp, validateOtp } from "~/composables/user";

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
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Must be a valid 10-digit phone number"),
  otp: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit OTP"),
});

const state = reactive({
  contactNumber: "",
  otp: "",
  sendOtpClicked: false,
  otpSent: false,
  otpValidation: false,
});

const handleSendOtpState = async () => {
  try {
    state.sendOtpClicked = true;
    buttonText.value = "Sending OTP...";

    const data = await sendOtp(
      base_url,
      brand_id,
      sessionId.value,
      state.contactNumber
    );

    if (data.loginStatus === "OTP") {
      state.otpSent = true;
      buttonText.value = "Validate OTP";
    } else {
      console.error("Failed to send OTP:", data);
      buttonText.value = "Send OTP";
    }
  } catch (error) {
    console.error("Error in sending OTP:", error);
    buttonText.value = "Send OTP";
  }
};

const toggleOtp = async () => {
  if (state.sendOtpClicked) {
    try {
      buttonText.value = "Validating OTP...";

      const datavalid = await validateOtp(
        base_url,
        brand_id,
        sessionId.value,
        state.contactNumber,
        state.otp
      );

      if (datavalid.valid) {
        state.otpValidation = true;
        localStorage.setItem("sessionId", datavalid.session);
        localStorage.setItem("user", datavalid.user);
        router.push("/account");
      } else {
        console.error("Invalid OTP or server error:", datavalid);
      }
    } catch (error) {
      console.error("Error in validating OTP:", error);
    } finally {
      buttonText.value = "Validate OTP";
    }
  } else {
    handleSendOtpState();
  }
};
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="px-8 space-y-5 my-8">
      <h1 class="text-2xl font-bold text-center">Sign In / Sign Up</h1>
      <p class="text-base font-medium text-center">
        Please enter your phone number to view your account.
      </p>

      <UForm :schema="schema" :state="state" class="space-y-4 mt-10">
        <UFormGroup label="Contact Number" name="contactNumber">
          <UInput
            v-model="state.contactNumber"
            type="text"
            placeholder="Enter 10-digit phone number"
          />
        </UFormGroup>

        <UFormGroup label="OTP" name="otp" v-if="state.otpSent">
          <UInput
            v-model="state.otp"
            type="text"
            placeholder="Enter 4-digit OTP"
          />
        </UFormGroup>

        <p class="text-sm font-light text-center">
          By signing in, you agree to our
          <NuxtLink to="/privacy">
            <u class="font-normal">privacy policy</u>
          </NuxtLink>
          and
          <NuxtLink to="/terms">
            <u class="font-normal">terms of service</u> </NuxtLink
          >.
        </p>

        <UButton
          type="button"
          class="w-full text-center flex justify-center text-lg"
          @click="toggleOtp"
        >
          {{ buttonText }}
        </UButton>
      </UForm>
    </div>
  </div>
</template>