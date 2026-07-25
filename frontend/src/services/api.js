const API_BASE = "http://localhost:5001/api";

/**
 * Upload CSV
 */
export async function uploadCSV(file, userId) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("userId", userId);

  const response = await fetch(`${API_BASE}/transactions/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload CSV");
  }

  return response.json();
}

/**
 * Dashboard Data
 */
export async function getDashboard(userId) {
  const response = await fetch(
    `${API_BASE}/leaks?userId=${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}

/**
 * Analyze Portfolio using SubscriptionIQ AI
 */
export async function analyzePortfolio(userId) {
  const response = await fetch(`${API_BASE}/ai/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to analyze portfolio");
  }

  return response.json();
}