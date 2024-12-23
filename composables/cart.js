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

export const addToCart = async (base_url, brand_id, sessionId, variantId, variantSize) => {
  try {
    const response = await fetch(
      `${base_url}/store/${brand_id}/cart?id=${variantId}`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
        body: JSON.stringify({
          variantName: variantSize,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
