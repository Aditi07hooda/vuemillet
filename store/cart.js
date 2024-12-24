import { defineStore } from "pinia";

export const useCartModelVisibilty = defineStore("cartModelVisibility", {
  state: () => ({
    isCartModelOpen: false,
  }),
  actions: {
    openCartModel() {
      this.isCartModelOpen = true;
    },
    closeCartModel() {
      this.isCartModelOpen = false;
    },
  },
});
