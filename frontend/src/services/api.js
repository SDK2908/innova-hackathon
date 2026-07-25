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
 * Get dashboard data
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
 * Run AI Agent
 */
export async function runAgent(agent, message = "") {
  const userId = localStorage.getItem("userId");

  const response = await fetch(`${API_BASE}/ai/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent,
      userId,
      message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to run AI agent");
  }

  return response.json();
}