export const fetchUserData = async () => {
  try {
    const { data } = await useFetch("/api/user", {
      headers: {
        session: localStorage.getItem("sessionId"),
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const fetchUserAddressData = async () => {
  try {
    const { data } = await useFetch("/api/userAddress", {
      headers: {
        session: localStorage.getItem("sessionId"),
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching user address data:", error);
  }
};