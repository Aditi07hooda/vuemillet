import WebFont from "webfontloader"

export default defineNuxtPlugin(() => {
  WebFont.load({
    google: {
      families: ['Poppins:300,400,500,600,700'],
    },
    active() {
      console.log('Google Fonts loaded');
    },
  });
});
