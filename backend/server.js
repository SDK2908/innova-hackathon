const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB Atlas (if MONGO_URI is present)
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('your_mongodb_connection_string')) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 MongoDB Atlas Connected'))
    .catch(err => console.error('🔴 MongoDB Connection Error:', err));
} else {
  console.log('🟡 Waiting for valid MONGO_URI in .env file...');
}

// 2. Chat Log Schema
const ChatLogSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now }
});
const ChatLog = mongoose.model('ChatLog', ChatLogSchema);

// 3. Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 Innova Hackathon Backend Server Running!');
});

// 4. Lyzr Agent Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Call Lyzr Studio REST API
    const response = await axios.post(
      'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      {
        user_id: userId || 'hackathon_user',
        agent_id: process.env.LYZR_AGENT_ID,
        session_id: `${process.env.LYZR_AGENT_ID || 'session'}-1`,
        message: message
      },
      {
        headers: {
          'x-api-key': process.env.LYZR_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data;

    // Async log save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      ChatLog.create({
        userMessage: message,
        botResponse: JSON.stringify(botReply)
      }).catch(err => console.error('MongoDB Save Error:', err));
    }

    res.json({ success: true, data: botReply });
  } catch (error) {
    console.error('Lyzr API Request Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to communicate with Lyzr Agent API',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));