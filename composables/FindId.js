export const findProductId = async (baseURL, brandID, sessionID, slug) => {
  const res = await fetch(`${baseURL}/store/${brandID}/products`, {
    headers: {
      session: sessionID,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const products = await res.json();
  if (!products.length) {
    throw new Error("No products found");
  }
  const product = products.find((product) => product.slug === slug);
  if (!product) {
    throw new Error("Product not found");
  }
  return product ? product.id : null;
};
