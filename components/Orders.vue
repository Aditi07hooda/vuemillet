<script setup>
import { reactive, onMounted } from "vue";
import { useCartModelVisibilty } from "~/store/cart";

const orders = reactive({
  orderList: [],
  orderDetails: [],
  productImage: [],
});

const getSessionId = () => localStorage.getItem("sessionId");

const cartModelVisible = useCartModelVisibilty();

const config = useRuntimeConfig();
const baseUrl = config.public.baseURL;
const brandId = config.public.brandID;

const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/store/${brandId}/auth/orders`, {
      headers: { session: getSessionId() },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    orders.orderList = data || [];
    orders.orderDetails = (await getOrderDetailsForAll(data)) || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(
      `${baseUrl}/store/${brandId}/auth/orders/${orderId}`,
      { headers: { session: getSessionId() } }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await getProductImage(data.lineItems);
    return data;
  } catch (error) {
    console.error(`Error fetching details for order ID ${orderId}:`, error);
    return null;
  }
};

const getOrderDetailsForAll = async (orders) => {
  try {
    const detailsPromises = orders.map((order) => getOrderDetails(order.id));
    const details = await Promise.all(detailsPromises);
    return details.map((detail) => detail || {});
  } catch (error) {
    console.error("Error fetching all order details:", error);
    return [];
  }
};

const getProductImage = async (items) => {
  try {
    for (let item of items) {
      const res = await fetch(
        `${baseUrl}/store/${brandId}/products/${item.product.id}`,
        { headers: { session: getSessionId() } }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // console.log("each product image in orders ", data.oneImg, data.images[0])
      const img = data.oneImg || data.images[0] || "./favicon.ico";
      orders.productImage.push(img);
      console.log("product images in orders", orders.productImage);
    }
  } catch (error) {
    console.error("Error getting product image in orders: ", error);
  }
};

onMounted(() => {
  getOrders();
});

const router = useRouter();

const handleNavigateToProduct = (slug) => {
  router.push(`/product/${slug}`);
};

const handleNavigateContact = (item) => {
  router.push(``);
};

const addingToCart = async (item) => {
  console.log(item);
  await addToCart(
    baseUrl,
    brandId,
    getSessionId(),
    item.variant.id,
    item.variant.name
  );
  cartModelVisible.openCartModel();
};
</script>

<template>
  <div
    class="orders-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

    <div v-if="orders.orderList.length > 0">
      <div
        v-for="(order, index) in orders.orderList"
        :key="index"
        class="order-item bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6 shadow hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex justify-between items-center">
          <p class="text-sm font-semibold text-gray-700">
            #{{ order.orderNo.replace("ORDER-", "") }}
          </p>
          <p
            :class="{
              'text-green-600': order.status === 'DELIVERED',
              'text-red-600': order.status === 'CANCELLED',
              'text-orange-500': order.status === 'OPEN',
              'text-yellow-500': order.status === 'SHIPPED',
              'text-pink-500': order.status === 'SCHEDULE',
              'text-violet-500': order.status === 'SHIPROCKET',
              'text-red-500': order.status === 'DRAFT',
            }"
            class="text-sm font-semibold"
          >
            {{ order.status }}
          </p>
          <p class="text-sm text-gray-500">{{ order.date }}</p>
        </div>

        <div class="w-full mt-5 gap-3 flex flex-col">
          <div
            class="w-full md:flex md:justify-between border-2 rounded-lg p-2"
          >
            <p
              v-if="orders.orderDetails[index]"
              class="text-base font-semibold md:w-[35%]"
            >
              Shipping Address:
              <span class="font-normal text-black">
                <br /><span class="font-medium">{{
                  orders.orderDetails[index]?.customerAddress?.person || "N/A"
                }}</span>
                <br />{{
                  orders.orderDetails[index]?.customerAddress?.fullAddress ||
                  "N/A"
                }}
              </span>
            </p>
            <p
              v-if="orders.orderDetails[index]"
              class="text-base font-semibold flex flex-col"
            >
              Payment Method:
              <span class="font-medium text-black">{{
                orders.orderDetails[index].modeOfPayment === "LATER"
                  ? "Cash"
                  : orders.orderDetails[index].modeOfPayment
              }}</span>
            </p>
            <div
              v-if="orders.orderDetails[index]"
              class="text-base font-semibold md:w-[30%]"
            >
              Order Summary:
              <p class="font-normal text-black flex justify-between">
                Item Subtotal :
                <span class="font-medium justify-end"
                  >Rs.
                  {{
                    orders.orderDetails[index].grossValue +
                    orders.orderDetails[index].discount -
                    orders.orderDetails[index].shipping
                  }}</span
                >
              </p>
              <p class="font-normal text-black flex justify-between">
                Shipping :
                <span class="font-medium justify-end"
                  >Rs. {{ orders.orderDetails[index].shipping }}</span
                >
              </p>
              <p class="font-normal text-black flex justify-between">
                Total :
                <span class="font-medium justify-end"
                  >Rs.
                  {{
                    orders.orderDetails[index].grossValue +
                    orders.orderDetails[index].discount
                  }}</span
                >
              </p>
              <p class="font-normal text-black flex justify-between">
                Discount :
                <span class="font-medium flex-end"
                  >- Rs. {{ orders.orderDetails[index].discount }}</span
                >
              </p>
              <p class="font-bold text-black flex justify-between">
                Grand Total :
                <span class="font-bold flex-end"
                  >Rs. {{ orders.orderDetails[index].grossValue }}</span
                >
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <NuxtLink
              to="https://wa.me/916362033034?text=Hello, I Want to Know More about this order "
              external
              target="_blank"
            >
              <button
                class="bg-pink-500 w-full text-white font-semibold hover:bg-pink-600 transition duration-300 px-5 py-1 text-[12px] rounded-full shadow-md"
              >
                Get Order Support
              </button>
            </NuxtLink>
          </div>
          <div class="w-full border-2 rounded-lg p-2">
            <div
              v-for="(item, i) in orders.orderDetails[index]?.lineItems ?? []"
              :key="i"
              class="mt-2"
            >
              <div class="flex justify-between md:flex-row flex-col">
                <div class="w-full md:w-3/4 flex gap-3">
                  <NuxtImg
                    provider="imgix"
                    src="orders.productImage[i] || './favicon.ico'"
                    class="w-16 h-20 object-cover rounded-md cursor-pointer"
                    @click="
                      handleNavigateToProduct(
                        item.product.slug || item.product.id
                      )
                    "
                    loading="lazy"
                  />
                  <div class="w-full">
                    <p
                      class="text-base cursor-pointer"
                      @click="
                        handleNavigateToProduct(
                          item.product.slug || item.product.id
                        )
                      "
                    >
                      <span class="font-semibold">{{ item.product.name }}</span>
                    </p>
                    <p
                      class="text-sm cursor-pointer"
                      @click="
                        handleNavigateToProduct(
                          item.product.slug || item.product.id
                        )
                      "
                    >
                      Quantity: <span class="font-medium">{{ item.qty }}</span>
                    </p>
                    <p
                      class="text-sm cursor-pointer"
                      @click="
                        handleNavigateToProduct(
                          item.product.slug || item.product.id
                        )
                      "
                    >
                      Price:
                      <span class="font-medium">Rs. {{ item.itemValue }}</span>
                    </p>
                    <p
                      class="text-sm cursor-pointer"
                      @click="
                        handleNavigateToProduct(
                          item.product.slug || item.product.id
                        )
                      "
                    >
                      Size:
                      <span class="font-medium">{{
                        item.variant.matrix.size ||
                        item.variant.matrix.Size ||
                        item.variant.matrix.SIZE
                      }}</span>
                    </p>
                    <div
                      class="flex flex-col md:flex-row md:gap-5 md:mt-3 my-2 gap-3 w-full"
                    >
                      <button
                        class="border-pink-600 border w-fit text-black font-semibold hover:bg-pink-300 transition duration-300 px-5 py-1 text-[12px] rounded-full shadow-md"
                        @click="addingToCart(item)"
                      >
                        Buy it again
                      </button>
                      <button
                        class="border-pink-600 border w-fit text-black font-semibold hover:bg-pink-300 transition duration-300 px-5 py-1 text-[12px] rounded-full shadow-md"
                        @click="
                          handleNavigateToProduct(
                            item.product.slug || item.product.id
                          )
                        "
                      >
                        View your item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <hr
                class="my-2"
                v-if="i !== orders.orderDetails[index]?.lineItems.length - 1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500">No orders found.</p>
  </div>
</template>
