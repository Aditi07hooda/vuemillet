export const getCheckoutDetails = async ({ baseUrl, brandId, sessionId }) => {
  try {
    const res = await fetch(`${baseUrl}/store/${brandId}/auth/checkout`, {
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
