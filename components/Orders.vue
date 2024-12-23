<script setup>
import { reactive, onMounted, computed } from "vue";

const orders = reactive({
  orderList: [],
  orderDetails: [],
});

const getSessionId = () => {
  return localStorage.getItem("sessionId");
};

const config = useRuntimeConfig();
const baseUrl = config.public.baseURL;
const brandId = config.public.brandID;

const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/store/${brandId}/auth/orders`, {
      headers: {
        session: getSessionId(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched orders:", data);

    orders.orderList = data || [];
    const detail = await getOrderDetailsForAll(data);
    orders.orderDetails = detail || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(
      `${baseUrl}/store/${brandId}/auth/orders/${orderId}`,
      {
        headers: {
          session: getSessionId(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
};

const getOrderDetailsForAll = async (orders) => {
  try {
    const detailsPromises = orders.map((order) => getOrderDetails(order.id));
    const details = await Promise.all(detailsPromises);
    console.log("Fetched all order details:", details);
    return details;
  } catch (error) {
    console.error("Error fetching all order details:", error);
  }
};

onMounted(() => {
  getOrders();
});
</script>

<template>
  <div
    class="orders-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

    <!-- Check if there are orders -->
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
              'text-green-600': order.status === 'Delivered',
              'text-red-600': order.status !== 'Delivered',
            }"
            class="text-sm font-semibold"
          >
            {{ order.status }}
          </p>
          <p class="text-sm text-gray-500">{{ order.date }}</p>
        </div>
        <p class="text-base font-semibold text-gray-800 mt-2">Items:</p>

        <div
          v-for="(item, i) in orders.orderDetails[index].lineItems ?? []"
          :key="i"
          class="mt-2 ml-4"
        >
          <p class="text-sm">
            Product Name:
            <span class="font-medium">{{ item.product.name }}</span>
          </p>
          <p class="text-sm">
            Quantity: <span class="font-medium">{{ item.qty }}</span>
          </p>
          <p class="text-sm">
            Price: <span class="font-medium">Rs. {{ item.itemValue }}</span>
          </p>
          <p class="text-sm">
            Size:
            <span class="font-medium">{{
              item.variant.matrix.size || item.variant.matrix.Size || item.variant.matrix.SIZE
            }}</span>
          </p>
          <hr class="my-2" />
        </div>
        <p class="text-sm font-semibold mt-3">
          Total Amount:
          <span class="text-green-600"
            >Rs. {{ orders.orderDetails[index].netValue }}</span
          >
        </p>
        <hr class="my-3" />
      </div>
    </div>

    <!-- No orders message -->
    <p v-else class="text-gray-500">No orders found.</p>
  </div>
</template>
