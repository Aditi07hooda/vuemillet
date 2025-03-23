export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const base_url = config.public.baseURL;
    const brand_id = config.public.brandID;
  
    const headers = getRequestHeaders(event);
    const sessionId = headers.session || "";
  
    if (!sessionId) {
      return { error: "Session ID missing" };
    }
  
    try {
      const response = await $fetch(`${base_url}/store/${brand_id}/auth/me`, {
        headers: { session: sessionId },
      });
  
      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { error: "Failed to fetch user data" };
    }
  });
  