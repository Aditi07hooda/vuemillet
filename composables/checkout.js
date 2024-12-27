export const getCheckoutDetails = async (base_url, brand_id, sessionId) => {
  try {
    const res = await fetch(`${base_url}/store/${brand_id}/auth/checkout`, {
      headers: {
        session: sessionId,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch checkout details");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching checkout details:", error);
  }
};
