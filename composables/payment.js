export const handleStartPayment = async (base_url, brand_id, sessionId, selectedAddress) => {
  try {
    const res = await $fetch(
      `${base_url}/store/${brand_id}/auth/checkout/payment?address_id=${selectedAddress.id}`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to start payment");

    const data = await res.json();
    console.log("Payment started in api", data);

    return data;
  } catch (error) {
    console.error("Error starting payment: ", error);
  }
};

export const handlePaymentComplete = async (base_url, brand_id, sessionId, response) => {
  try {
    const res = await $fetch(
      `${base_url}/store/${brand_id}/auth/checkout/payment/complete`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
        body: JSON.stringify(response),
      }
    );
    if (!res.ok) throw new Error("Failed to complete payment");

    const data = await res.json();
    console.log("Payment completed in api", data);

    return data;
  } catch (error) {
    console.error("Error completing payment: ", error);
  }
};

export const handlePaymentCancel = async (base_url, brand_id, sessionId, reason, orderId) => {
    try {
      const payload = { reason, orderId };
      const res = await $fetch(
        `${base_url}/store/${brand_id}/auth/checkout/payment`,
        {
          method: "DELETE",
          headers: {
            session: sessionId,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to cancel payment");
      const data = await res.json();
      console.log("Payment cancelled in api", data);

      return data;
    } catch (error) {
      console.error("Payment cannot be cancelled", error);
    }
  };
