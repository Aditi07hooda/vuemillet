export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const config = useRuntimeConfig();

  const baseUrl = config.public.baseURL;
  const brandId = config.public.brandID;
  const sessionId = getHeader(event, "session");

  if (!sessionId) {
    return { error: "Unauthorized", status: 401 };
  }

  switch (method) {
    case "GET":
      return await fetchAddresses(baseUrl, brandId, sessionId);
    case "POST":
      const body = await readBody(event);
      return await saveAddress(baseUrl, brandId, sessionId, body);
    case "PUT":
      const id = getQuery(event).id;
      const updateBody = await readBody(event);
      return await updateAddress(baseUrl, brandId, sessionId, id, updateBody);
    default:
      return { error: "Method Not Allowed", status: 405 };
  }
});

async function fetchAddresses(baseUrl, brandId, sessionId) {
  const res = await fetch(`${baseUrl}/store/${brandId}/auth/address`, {
    headers: { session: sessionId },
  });
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return await res.json();
}

async function saveAddress(baseUrl, brandId, sessionId, body) {
  const res = await fetch(`${baseUrl}/store/${brandId}/auth/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      session: sessionId,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to save address");
  return await res.json();
}

async function updateAddress(baseUrl, brandId, sessionId, id, body) {
  const res = await fetch(`${baseUrl}/store/${brandId}/auth/address/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      session: sessionId,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update address");
  return await res.json();
}