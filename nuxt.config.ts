// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-lucide-icons', '@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700], // Load Poppins with different weights
    },
    display: "swap",
  },
  // Add runtimeConfig
  runtimeConfig: {
    // Server-side only variables
    baseURL: process.env.BASE_URL,
    brandID: process.env.BRAND_ID,

    // Public variables (accessible client-side)
    public: {
      baseURL: process.env.BASE_URL, // Include only if required on client-side
      brandID: process.env.BRAND_ID,
    },
  },
  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" }
      ],
      script: [
        {
          src: "https://checkout.razorpay.com/v1/checkout.js",
          defer: true,
        },
      ],
    },
  },
})