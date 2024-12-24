// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui','nuxt-lucide-icons']  ,	  // Add runtimeConfig
  runtimeConfig: {
    // Server-side only variables
    baseURL: process.env.VUE_APP_BASE_URL,
    brandID: process.env.VUE_APP_BRAND_ID,

    // Public variables (accessible client-side)
    public: {
      baseURL: process.env.VUE_APP_BASE_URL, // Include only if required on client-side
      brandID: process.env.VUE_APP_BRAND_ID,
    },
  },
})