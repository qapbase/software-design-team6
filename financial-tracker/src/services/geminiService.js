const API_BASE = "http://localhost:5000/api";

export async function sendMessage(message, history = []) {
  try {
    const response = await fetch(`${API_BASE}/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return data.error || "Something went wrong. Please try again.";
    }

    return data.reply;
  } catch (error) {
    console.error("Assistant API error:", error);
    return "Unable to connect to the server. Please check if the backend is running.";
  }
}

export async function getRecommendations() {
  try {
    const response = await fetch(`${API_BASE}/assistant/recommendations`);
    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    return data.recommendations || [];
  } catch (error) {
    console.error("Recommendations API error:", error);
    return [];
  }
}