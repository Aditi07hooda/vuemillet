<template>
  <Head>
    <Title>{{ Title }}</Title>
    <Meta name="description" :content="description" />
    <Meta name="keywords" :content="keywords" />
  </Head>
  <div>
    <div v-if="isHomePage" class="home-container">
      <!-- <div class="full-height-header">
        <HeaderCarousel />
      </div>
      <BrandTags />
      <div class="overlay-navbar w-full" v-show="showNavbar">
          <Navbar />
      </div> -->
      <Navbar />
      <HeaderCarousel />
      <BrandTags />
    </div>
    <div v-else>
      <Navbar />
    </div>
    <NuxtPage />
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import HeaderCarousel from "./components/HeaderCarousel.vue";
import Navbar from "./components/Navbar.vue";
import BrandTags from "./components/BrandTags.vue";

export default {
  components: {
    HeaderCarousel,
    Navbar,
  },
  setup() {
    const route = useRoute();
    const isHomePage = computed(() => route.path === "/");
    const showNavbar = ref(true);
    const lastScrollY = ref(0);

    const Title = ref("The Millet Store - We Make Food Delicious");
    const description = ref(
      "The Millet Store is a women driven enterprise with the aim of making your food healthy yet irresistibly delicious! Our products are made of premium quality ingredients and are prepared only after receiving Your order."
    );
    const keywords = ref(
      "millet store near me,millet store in bangalore,millets online store,millets wholesale shop near me,unpolished millets in bangalore,millets delivery,dr khader vali millets online shopping,best millets online,online millet store,millet prices in bangalore,millet products,millet shop jabanagar,millet store jabanagar,millet shop in bangalore,millet,sharbathi atta,jaggery,freshly milled,buckwheat,Sprouted Wheat,Sprouted Millets,Activated Millets,Sprouted Moong dal flour, Sprouted Ragi flour"
    );

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
        showNavbar.value = false;
      } else if (currentScrollY <= 50) {
        showNavbar.value = true;
      }

      lastScrollY.value = currentScrollY; // Update last scroll position
    };

    onMounted(() => {
      if (isHomePage.value) {
        window.addEventListener("scroll", handleScroll);
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      isHomePage,
      showNavbar,
      Title,
      description,
      keywords,
    };
  },
};
</script>

<style>
.home-container {
  position: relative;
}

.overlay-navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateY(0); /* Initial position */
}

.overlay-navbar[style*="display: none"] {
  transform: translateY(-100%);
  opacity: 0;
}

.full-height-header {
  height: 100vh;
  width: 100%;
  position: relative;
  z-index: 0;
}
</style>
