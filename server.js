const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Conversation history storage (per user)
const conversationHistory = new Map();

// ─── Gemini AI helper ─────────────────────────────────────────────────────────
async function getGeminiResponse(message, history = []) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — using smart fallback');
    return null;
  }

  try {
    // Build conversation context
    const systemInstruction = `You are EduBot, a friendly and knowledgeable AI teaching assistant for an online learning platform called CourseLit.
Your role is to:
- Help students understand course concepts clearly and concisely
- Answer questions about programming, mathematics, science, and general academics
- Encourage students and keep them motivated
- Provide code examples when helpful (use markdown code blocks)
- Break down complex topics into simple steps
Keep responses focused, helpful, and under 300 words unless a detailed explanation is truly needed.`;

    // Format history for Gemini
    const formattedContents = [];
    const recentHistory = history.slice(-8);
    for (const h of recentHistory) {
      formattedContents.push({ role: 'user', parts: [{ text: h.user }] });
      formattedContents.push({ role: 'model', parts: [{ text: h.bot }] });
    }
    formattedContents.push({ role: 'user', parts: [{ text: message }] });

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 512
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error('Gemini fetch error:', err.message);
    return null;
  }
}

// ─── Smart fallback responses ──────────────────────────────────────────────────
function getSmartFallback(message) {
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 I'm EduBot, your AI learning assistant. How can I help you today? You can ask me about any topic you're studying!";
  }
  if (lower.includes('react')) {
    return "React is a JavaScript library for building user interfaces. It uses a component-based architecture where UI is broken into reusable pieces. Key concepts include:\n\n• **Components** — reusable UI blocks\n• **Props** — data passed between components\n• **State** — dynamic data that triggers re-renders\n• **Hooks** — like useState, useEffect for logic\n\nWould you like a code example?";
  }
  if (lower.includes('javascript') || lower.includes('js')) {
    return "JavaScript is the programming language of the web! It runs in browsers and on servers (via Node.js). Key concepts:\n\n• Variables (let, const, var)\n• Functions & arrow functions\n• Promises & async/await\n• DOM manipulation\n\nWhat specific JS topic would you like to explore?";
  }
  if (lower.includes('python')) {
    return "Python is a versatile, beginner-friendly language used in web development, data science, AI, and automation. Its clean syntax makes it great for learning programming fundamentals. What aspect of Python are you studying?";
  }
  if (lower.includes('thank')) {
    return "You're welcome! 😊 Keep up the great work with your studies. Feel free to ask anytime you're stuck!";
  }
  const fallbacks = [
    "That's a great question! Could you provide more context so I can give you the best answer? I'm here to help with any topic you're studying.",
    "I'd love to help you with that. Can you tell me which course or subject this relates to?",
    "Interesting! Let me help you understand this better. Could you elaborate on what specifically you'd like to learn?"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─── REST endpoint (HTTP fallback) ────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId = 'anonymous' } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message required' });

    if (!conversationHistory.has(userId)) conversationHistory.set(userId, []);
    const history = conversationHistory.get(userId);

    const botResponse = (await getGeminiResponse(message, history)) || getSmartFallback(message);

    history.push({ user: message, bot: botResponse, timestamp: new Date() });
    if (history.length > 30) history.shift();

    res.json({ success: true, message: botResponse });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ success: true, message: getSmartFallback(req.body?.message || '') });
  }
});

// Get conversation history
app.get('/api/chat/history/:userId', (req, res) => {
  const history = conversationHistory.get(req.params.userId) || [];
  res.json({ success: true, history });
});

// Clear conversation
app.post('/api/chat/clear', (req, res) => {
  const { userId } = req.body;
  conversationHistory.delete(userId);
  res.json({ success: true, message: 'Conversation cleared' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    gemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date()
  });
});

// ─── Socket.IO real-time chat ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('chat_message', async ({ message, userId = 'anonymous' }) => {
    if (!message?.trim()) return;

    if (!conversationHistory.has(userId)) conversationHistory.set(userId, []);
    const history = conversationHistory.get(userId);

    // Emit typing indicator
    socket.emit('bot_typing', { typing: true });

    const botResponse = (await getGeminiResponse(message, history)) || getSmartFallback(message);

    // Simulate streaming — emit word by word for typewriter effect
    socket.emit('bot_typing', { typing: false });

    const words = botResponse.split(' ');
    let streamed = '';
    for (let i = 0; i < words.length; i++) {
      streamed += (i > 0 ? ' ' : '') + words[i];
      socket.emit('bot_stream', { chunk: (i > 0 ? ' ' : '') + words[i], full: streamed, done: i === words.length - 1 });
      await new Promise(r => setTimeout(r, 30)); // 30ms between words
    }

    // Save to history
    history.push({ user: message, bot: botResponse, timestamp: new Date() });
    if (history.length > 30) history.shift();
  });

  socket.on('clear_history', ({ userId }) => {
    conversationHistory.delete(userId);
    socket.emit('history_cleared');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ─── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.AI_PORT || 5001;
server.listen(PORT, () => {
  console.log('\n🤖 EduBot AI Server is running!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ Connected' : '⚠️  Not configured (using fallback)'}`);
  console.log(`⚡ Socket.IO: ✅ Enabled\n`);
});