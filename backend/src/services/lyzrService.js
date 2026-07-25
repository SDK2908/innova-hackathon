const axios = require("axios");
const { v4: uuid } = require("uuid");

const lyzr = require("../config/lyzr");

async function runLyzrAgent(userId, prompt) {
  try {
    const response = await axios.post(
      lyzr.endpoint,
      {
        user_id: userId,
        agent_id: lyzr.agents.master,
        session_id: uuid(),
        message: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": lyzr.apiKey,
        },
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lyzr API Error");

    if (error.response) {
      console.error(error.response.data);

      throw new Error(
        error.response.data?.message ||
          "Lyzr API returned an error."
      );
    }

    throw new Error(
      error.message || "Unable to connect to Lyzr API."
    );
  }
}

module.exports = {
  runLyzrAgent,
};