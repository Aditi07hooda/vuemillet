import { defineNuxtPlugin } from '#app';
import VueImgix from '@imgix/vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueImgix, {
    domain: "themilletstore.imgix.net",
    defaultIxParams: {
      auto: 'format',
    },
  });
});