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



export const sendOtp = async (base_url, brand_id, sessionId, contactNumber) => {
  try {
    const response = await fetch(`${base_url}/store/${brand_id}/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        session: sessionId,
      },
      body: new URLSearchParams({
        mobile: contactNumber,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }

    const data = await response.json();
    // console.log("OTP sent successfully", data);
    return data;
  } catch (error) {
    console.error("Error sending OTP", error);
  }
};

// Validate OTP function
export const validateOtp = async (base_url, brand_id, sessionId, contactNumber, otp) => {
  try {
    const response = await fetch(`${base_url}/store/${brand_id}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${sessionId}`,
        session: sessionId,
      },
      body: new URLSearchParams({
        mobile: contactNumber,
        otp: otp,
        action: "OTP",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to validate OTP");
    }

    const data = await response.json();
    // console.log("OTP validated successfully", data);
    return data;
  } catch (error) {
    console.error("Error validating OTP", error);
  }
};
