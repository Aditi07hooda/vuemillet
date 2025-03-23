export const fetchProductsForCollection = async (baseURL, brandID, sessionID, id) => {
  try {
    const res = await $fetch(`${baseURL}/store/${brandID}/collections/${id}/products`, {
      headers: {
        session: sessionID,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch collection products");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching collection products");
  }
};
