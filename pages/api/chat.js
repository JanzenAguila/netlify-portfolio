const { answerProfile, validateMessages } = require('../../lib/profile-chat.cjs');

const windows = new Map();
export const config = { api: { bodyParser: { sizeLimit: '28kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Please send a chat message.' });
  }
  if (!validateMessages(req.body?.messages)) return res.status(400).json({ error: 'Please start a new chat or shorten your message.' });
  const now = Date.now();
  for (const [key, value] of windows) if (value.until <= now) windows.delete(key);
  const key = req.socket?.remoteAddress || 'visitor';
  const bucket = windows.get(key) || { count: 0, until: now + 60000 };
  if (bucket.count >= 5 || windows.size >= 1000) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Please wait a minute before asking again.' });
  }
  bucket.count++;
  windows.set(key, bucket);
  if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'The assistant is not connected yet. Please use the portfolio’s contact links.' });
  try {
    const answer = await answerProfile(req.body.messages, { apiKey: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_FREE_MODEL });
    return res.status(200).json({ answer });
  } catch {
    return res.status(503).json({ error: 'The free assistant is unavailable right now. Please try later or contact Janzen through the portfolio.' });
  }
}
