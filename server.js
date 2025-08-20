const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API route
app.post("/api/faq-response", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ response: "❌ No message provided." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a friendly go-karting venue assistant. Answer briefly, include links if helpful, and be helpful regarding ticketing, bookings, and venue details."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.6
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({
      response: "⚠️ Sorry, there was a problem generating the response."
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Chatbot API running at http://localhost:${port}`);
});
