export const findProductId = async (baseURL, brandID, sessionID, slug) => {
  const res = await $fetch(`${baseURL}/store/${brandID}/products`, {
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
  const product = products.find((product) => product.slug === slug || product.id === slug);
  if (!product) {
    throw new Error("Product not found");
  }
  return product ? product.id : null;
};

export const findCollectionId = async (baseURL, brandId, sessionId, slug) => {
  const res = await $fetch(`${baseURL}/store/${brandId}/collections?`, {
    headers: {
      session: sessionId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const categories = await res.json();
  if (!categories.length) {
    throw new Error("No categories found");
  }
  const category = categories.find((category) => category.slug === slug || category.id === slug);
  if (!category) {
    throw new Error("Category not found");
  }
  return category ? category.id : null
};
