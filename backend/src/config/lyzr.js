require("dotenv").config();

module.exports = {
  apiKey: process.env.LYZR_API_KEY,

  endpoint:
    "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",

  agents: {
    forensics: process.env.FORENSICS_AGENT_ID,

    recovery: process.env.RECOVERY_AGENT_ID,

    intelligence: process.env.INTELLIGENCE_AGENT_ID,

    simulator: process.env.SIMULATOR_AGENT_ID,

    resolution: process.env.RESOLUTION_AGENT_ID,

    executive: process.env.EXECUTIVE_AGENT_ID,
  },
};