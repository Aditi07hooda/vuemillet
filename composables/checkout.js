export const getCheckoutDetails = async (base_url, brand_id, sessionId) => {
  try {
    const res = await $fetch(`${base_url}/store/${brand_id}/auth/checkout`, {
      headers: {
        session: sessionId,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch checkout details");
    }
    const data = await res.json();

    const products = await fetchProducts(base_url, brand_id, sessionId);
    let productImage = [];
    data.cart.items.forEach((item) => {
      var pr = null;
      const product = products.forEach((p) => {
        p.variants.find((variant) => {
          if (variant.id === item.variantId) {
            pr = p;
          }
        });
      });
      productImage.push(pr.oneImg);
    });

    return { data, productImage };
  } catch (error) {
    console.error("Error fetching checkout details:", error);
  }
};

export const applyDiscount = async (base_url, brand_id, sessionId, code) => {
    try {
        const res = await $fetch(`${base_url}/store/${brand_id}/auth/checkout/discount`,{
            method: 'POST',
            headers: {
                session: sessionId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        })
        if (!res.ok) {
            return "Invalid discount code";
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error applying discount:", error);
    }
}
