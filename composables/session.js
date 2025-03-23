export const createSessionId = async (baseURL, brandID) => {
  try {
    const response = await $fetch(`${baseURL}/store/${brandID}/init`, {
      method: "POST",
    });

    const data = await response.json();
    const sessionId = data.session;

    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error("Unable to create session id", error);
    return null;
  }
};

export const fetchBrandInfo = async (baseURL, brandID) => {
  try {
    const response = await $fetch(`${baseURL}/store/${brandID}/init`, {
      method: "POST",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Unable to create session id", error);
    return null;
  }
};

export const fetchKeyWords = async (baseURL, brandID, sessionId) => {
  try {
    const response = await $fetch(
      `${baseURL}/store/${brandID}/config?key=SITE_KEYWORDS`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Unable to fetch keywords", error);
    return null;
  }
};
