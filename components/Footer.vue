<script setup>
const footerItems = [
  {
    label: "About us",
    slot: "about",
  },
  {
    label: "Help",
    slot: "help",
  },
  {
    label: "Contact Us",
    slot: "contact",
  },
];

const items = [
  {
    label: "Getting Started",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    label: "Installation",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    label: "Theming",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    label: "Layouts",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    label: "Components",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    label: "Utilities",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
</script>

<template>
  <div
    class="footer-bg-color text-white mt-5 w-full max-w-full overflow-x-hidden"
  >
    <div class="flex md:px-8 px-1 py-2 md:py-4 justify-between border-b-2">
      <h2>
        <NuxtLink class="hover:text-pink-400 font-semibold transition duration-500" to="/">
          The Millet Store
        </NuxtLink>
      </h2>
      <div class="flex justify-between gap-1">
        <a
          class="text-white md:p-2 rounded md:me-2 flex items-center"
          href="mailto:hello@themilletstore.in"
        >
          <LucideMail />
        </a>
        <a class="text-white md:p-2 rounded md:me-2 flex items-center" href="">
          <LucideInstagram />
        </a>
        <a class="text-white md:p-2 rounded md:me-2 flex items-center" href="">
          <LucideFacebook />
        </a>
        <a class="text-white md:p-2 rounded md:me-2 flex items-center" href="">
          <LucideLinkedin />
        </a>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-evenly md:p-4">
      <div class="flex-1 md:p-4 hidden md:block">
        <h2 class="mb-3">About Us</h2>
        <ul>
          <li>
            <a
              href="/about"
              class="hover:text-pink-400 transition duration-500"
            >
              Our Story
            </a>
          </li>
          <li>
            <a
              href="/learn"
              class="hover:text-pink-400 transition duration-500"
            >
              Learn with Us
            </a>
          </li>
        </ul>
      </div>
      <div class="flex-1 md:p-4 hidden md:block">
        <h2 class="mb-3">Help</h2>
        <ul>
          <li>
            <a href="/terms" class="hover:text-pink-400 transition duration-500"
              >Terms</a
            >
          </li>
          <li>
            <a
              href="/privacy"
              class="hover:text-pink-400 transition duration-500"
              >Privacy</a
            >
          </li>
          <li>
            <a
              href="/shipping"
              class="hover:text-pink-400 transition duration-500"
              >Shipping & Returns</a
            >
          </li>
        </ul>
      </div>
      <div class="flex-1 md:p-4 hidden md:block">
        <h2 class="mb-3">Contact</h2>
        <div>
          <div>The Millet Store</div>
          <address class="not-italic">
            📍 Sy No 114, 1, TK Falls Road, Uttarahalli Hobli, Gulakamale,
            Bengaluru, Karnataka 560082
          </address>
          <a href="mailto:hello@themilletstore.in" class="flex">
            <span class="me-2">✉️ </span>
            <span class="underline hover:text-pink-400 transition duration-500">
              hello@themilletstore.in</span
            >
          </a>
        </div>
      </div>

      <div class="md:hidden mx-2">
        <UAccordion :items="footerItems" color="inherit">
          <template #default="{ item, index, open }">
            <UButton
              color="inherit"
              variant="ghost"
              class="border-b border-white"
              :ui="{ padding: { sm: 'pb-3' } }"
            >
              <span class="uppercase text-base text-white">{{
                item.label
              }}</span>

              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-180']"
                />
              </template>
            </UButton>
          </template>
          <template #about>
            <div class="flex flex-col space-y-3 ml-4">
              <NuxtLink to="/about" class="text-white text-sm font-medium"
                >Our Story</NuxtLink
              >
              <NuxtLink to="/learn" class="text-white text-sm font-medium"
                >Learn with us</NuxtLink
              >
            </div>
          </template>
          <template #help>
            <div class="flex flex-col space-y-3 ml-4">
              <NuxtLink to="/terms" class="text-white text-sm font-medium"
                >Terms</NuxtLink
              >
              <NuxtLink to="/privacy" class="text-white text-sm font-medium"
                >Privacy</NuxtLink
              >
              <NuxtLink to="/shipping" class="text-white text-sm font-medium"
                >Shipping & Returns</NuxtLink
              >
            </div>
          </template>
          <template #contact>
            <div class="flex flex-col space-y-3 ml-4 text-white">
              <div class="font-semibold text-base">The Millet Store</div>
              <address class="not-italic">
                📍Sy No 114, 1, TK Falls Road, Uttarahalli Hobli, Gulakamale,
                Bengaluru, Karnataka 560082
              </address>
              <a href="mailto:hello@themilletstore.in" class="flex">
                <span class="me-2">✉️</span>
                <span class="underline hover:text-pink-400 transition duration-500">
                  hello@themilletstore.in</span
                >
              </a>
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
    <div class="text-end p-4">
      All Rights Reserved © Basuvaraj (OPC) Private Limited
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 25px;
  text-transform: uppercase;
}

ul li {
  font-size: 18px;
}

address {
  font-size: 16px;
}

.footer-bg-color {
  background-color: darkgreen;
}

.custom-label {
  text-transform: uppercase !important;
  font-size: 1.125rem !important;
}
</style>
