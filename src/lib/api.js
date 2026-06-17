const API_URL = import.meta.env.VITE_TICKETNI_API;

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

export async function getPaymentInfo() {
    const response = await fetch(`${API_URL}/api/payment-info`);

    if (!response.ok) {
        throw new Error("Failed to fetch payment info");
    }

    return response.json();
}

export async function uploadReceipt(orderId, file) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/api/orders/${orderId}/upload-receipt`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload receipt");
    }

    return response.json();
}

export async function getOrder(orderId) {
    const response = await fetch(
        `${API_URL}/api/orders/${orderId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }

    return response.json();
}