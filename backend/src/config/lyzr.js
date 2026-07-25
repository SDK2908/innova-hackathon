require("dotenv").config();

module.exports = {
  apiKey: process.env.LYZR_API_KEY,

  endpoint:
    "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",

  agents: {
    master: process.env.MASTER_AGENT_ID,
  },
};