// Simple backend using Node.js and Express with a JSON file as a database
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize db.json if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ messages: [] }, null, 2));
}

// Get all messages
app.get('/api/messages', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(db.messages);
});

// Add a new message
app.post('/api/messages', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE));
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  db.messages.push({ text, date: new Date().toISOString() });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
