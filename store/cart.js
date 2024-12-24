import { defineStore } from "pinia";

export const useCartModelVisibilty = defineStore("cartModelVisibility", {
  state: () => ({
    isCartModelOpen: false,
  }),
  actions: {
    openCartModel() {
      this.isCartModelOpen = true;
      console.log("cart modal visibilty: ",useCartModelVisibilty.isCartModelOpen);
    },
    closeCartModel() {
      this.isCartModelOpen = false;
      console.log("cart modal visibilty: ",useCartModelVisibilty.isCartModelOpen);
    },
  },
});
