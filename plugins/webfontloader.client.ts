export default defineNuxtPlugin(() => {
    if (import.meta.server) return; // Prevents execution on the server
  
    import('webfontloader').then((WebFont) => {
      WebFont.load({
        google: {
          families: ['Poppins:300,400,500,600&display=swap'],
        },
      });
    });
  });  