// Secure API Server Configuration
// This is a template for your backend API server

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API routes
app.post('/api/openai/generate-text', async (req, res) => {
  try {
    const { messages, model, max_tokens, temperature } = req.body;
    
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages,
      max_tokens: max_tokens || 1000,
      temperature: temperature || 0.7
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/openai/generate-image', async (req, res) => {
  try {
    const { prompt, n, size, response_format } = req.body;
    
    const response = await openai.images.generate({
      prompt,
      n: n || 1,
      size: size || '512x512',
      response_format: response_format || 'url'
    });

    res.json({ result: response.data[0].url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
