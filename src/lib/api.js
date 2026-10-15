const API_URL = import.meta.env.VITE_TICKETNI_API;

function getOrderAccessToken(orderId, fallbackToken) {
    let storedToken = null;
    try {
        storedToken = orderId
            ? window.localStorage.getItem(`ticketni_token_${orderId}`)
            : null;
        storedToken ||= window.localStorage.getItem("ticketni_order_access_token");
    } catch (storageError) {
        console.warn("Could not read the saved local order authorization token.", storageError);
    }

    if (!storedToken) {
        try {
            storedToken = window.sessionStorage.getItem("ticketni_order_access_token");
        } catch (storageError) {
            console.warn("Could not read the saved session order authorization token.", storageError);
        }
    }

    const token = storedToken || fallbackToken;
    if (!token) {
        console.warn("Order access token is missing; sending the request with its order identifier only.");
    }

    return token;
}

export async function getEvents() {
const response = await fetch(`${API_URL}/api/events`)

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function getEvent(id) {
    const response = await fetch(`${API_URL}/api/events/${id}`)

    if (!response.ok) {
        throw new Error("Failed to fetch event");
    }

    return response.json();
}

export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        throw new Error("Failed to create order");
    }

    return response.json();
}

export async function getPaymentInfo(token) {
    const accessToken = getOrderAccessToken(null, token);
    const response = await fetch(`${API_URL}/api/payment-info`, {
        headers: accessToken ? { "X-Order-Access-Token": accessToken } : {},
    });

    if (!response.ok) {
        throw new Error("Failed to fetch payment info");
    }

    return response.json();
}

export async function uploadReceipt(orderId, file, token) {
    const formData = new FormData();

    formData.append("file", file);

    const accessToken = getOrderAccessToken(orderId, token);
    const response = await fetch(
        `${API_URL}/api/orders/${orderId}/upload-receipt`,
        {
            method: "POST",
            headers: accessToken ? { "X-Order-Access-Token": accessToken } : {},
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload receipt");
    }

    return response.json();
}

export async function getOrder(orderId, token) {
    const accessToken = getOrderAccessToken(orderId, token);
    const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
            headers: accessToken ? { "X-Order-Access-Token": accessToken } : {},
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }

    return response.json();
}