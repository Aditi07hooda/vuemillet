export const handleStartPayment = async (base_url, brand_id, sessionId) => {
  try {
    const res = await fetch(
      `${base_url}/store/${brand_id}/auth/checkout/payment?address_id=${state.selectedAddress.id}`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to start payment");

    const data = await res.json();

    data["handler"] = async (response) => {
      await handlePaymentComplete(response);
    };
    data["modal"] = {
      ondismiss: async () => {
        console.log("payment window dismissed");
      },
    };

    let rzp1 = new Razorpay(data);
    rzp1.on("payment.failed", async (response) => {
      console.error("Payment failed:", response.error);
      await handlePaymentCancel(
        "payment failed",
        response.error.metadata.order_id
      );
    });

    rzp1.open();
    console.log("Payment started");
    return data;
  } catch (error) {
    console.error("Error starting payment: ", error);
  }
};

export const handlePaymentComplete = async (base_url, brand_id, sessionId, response) => {
  try {
    const res = await fetch(
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
    console.log("Payment completed", data);
    return data;
  } catch (error) {
    console.error("Error completing payment: ", error);
  }
};

export const handlePaymentCancel = async (base_url, brand_id, sessionId, reason, orderId) => {
    try {
      const payload = { reason, orderId };
      const res = await fetch(
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
      console.log("Payment cancelled", data);
      return data;
    } catch (error) {
      console.error("Payment cannot be cancelled", error);
    }
  };
