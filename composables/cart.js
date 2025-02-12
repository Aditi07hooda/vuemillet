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
    const products = await fetchProducts(base_url, brand_id, sessionId);
    // console.log("Fetched Products in cart:", products);

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

    // console.log("Fetched Product Images in cart:", productImage);
    return { data, productImage };
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

export const addToCart = async (
  base_url,
  brand_id,
  sessionId,
  variantId,
  variantSize
) => {
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

export const removeFromCart = async (
  base_url,
  brand_id,
  sessionId,
  variantId,
  variantSize
) => {
  try {
    const response = await fetch(
      `${base_url}/store/${brand_id}/cart?id=${variantId}`,
      {
        method: "DELETE",
        headers: {
          session: sessionId,
        },
        body: JSON.stringify({
          variantName: variantSize,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove from cart");
    }
    return response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const fetchProducts = async (base_url, brand_id, sessionId) => {
  try {
    const res = await fetch(`${base_url}/store/${brand_id}/products`, {
      headers: {
        session: sessionId,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export const emptyCart = async (base_url, brand_id, sessionId, cartItem) => {
  const { data, productImage } = await fetchCartItems(
    base_url,
    brand_id,
    sessionId
  );
  if (data.cart.items.length === 0) {
    return;
  }
  let productData = {};
  data.cart.items.forEach((item) => {
    if (cartItem.variantId === item.variantId) {
      productData = item;
    }
  });
  for (let i = 0; i < productData.qty; i++) {
    await removeFromCart(
      base_url,
      brand_id,
      sessionId,
      productData.variantId,
      productData.size
    );
  }
  return "successfully deleted the cart item";
};

export const getProductId = async (
  base_url,
  brand_id,
  sessionId,
  variantId,
  variantName
) => {
  try {
    const productsData = await fetchProducts(base_url, brand_id, sessionId);
    let id = "";
    const product = productsData.forEach((p) => {
      p.variants.find((variant) => {
        if (variant.id === variantId && variant.name === variantName) {
          id = p.slug || p.id;
        }
      });
    });
    return id;
  } catch (error) {
    console.error("error finding the product id");
  }
};
