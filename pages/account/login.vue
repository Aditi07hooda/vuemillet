<script setup>
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event) {
  console.log(event.data);
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="px-8 space-y-5 my-8">
      <h1 class="text-2xl font-bold text-center">Login</h1>
      <p class="text-base font-medium text-center">
        Welcome Back! Please enter your email and password to view your account.
      </p>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 mt-10 !important"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
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
          >Sign in
        </UButton>
        <NuxtLink to="/account/register">
            <p class="text-sm text-center font-medium hover:underline text-gray-600 hover:text-gray-800 mt-5">
                Create an account!
            </p>
        </NuxtLink>    
      </UForm>
    </div>
  </div>
</template>
