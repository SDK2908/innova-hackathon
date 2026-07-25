const axios = require("axios");
const { v4: uuid } = require("uuid");

const lyzr = require("../config/lyzr");

async function runLyzrAgent(agent, userId, prompt) {
  const agentId = lyzr.agents[agent];

  if (!agentId) {
    throw new Error(`Invalid agent: ${agent}`);
  }

  try {
    const response = await axios.post(
      lyzr.endpoint,
      {
        user_id: userId,
        agent_id: agentId,
        session_id: uuid(),
        message: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": lyzr.apiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lyzr API Error:");

    if (error.response) {
      console.error(error.response.data);

      throw new Error(
        error.response.data?.message ||
          "Lyzr API returned an error."
      );
    }

    throw new Error(error.message || "Unable to connect to Lyzr API.");
  }
}

module.exports = {
  runLyzrAgent,
};