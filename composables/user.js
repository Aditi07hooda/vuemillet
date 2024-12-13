export const fetchUserData = async (base_url, brand_id, sessionId) => {
  try {
    const response = await fetch(`${base_url}/store/${brand_id}/auth/me`, {
      headers: {
        session: sessionId,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const fetchUserAddressData = async (base_url, brand_id, sessionId) => {
  try {
    const response = await fetch(`${base_url}/store/${brand_id}/auth/address`, {
      headers: {
        session: sessionId,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user address data");
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user address data:", error);
  }
};
