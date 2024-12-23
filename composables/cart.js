export const fetchCartItems = async (base_url, brand_id, sessionId) => {
  try {
    const response = await fetch(`${base_url}/store/${brand_id}/cart/full`, {
      headers: {
        session: sessionId,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
