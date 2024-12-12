<script setup>
import { z } from "zod";

const schema = z.object({
  username: z.string().min(4, "Must be at least 4 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Must be at least 8 characters"),
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
      <h1 class="text-2xl font-bold text-center">Create Account</h1>
      <p class="text-base font-medium text-center">
        Please enter your details below to create an account.
      </p>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 mt-10 !important"
        @submit="onSubmit"
      >
      
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

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
          >Create
        </UButton>
        <p
          class="text-sm text-center font-medium text-gray-600 mt-5"
        >
          Already have a account?
          <NuxtLink to="/account/login" class="hover:underline hover:text-gray-800"> Sign in! </NuxtLink>
        </p>
      </UForm>
    </div>
  </div>
</template>
