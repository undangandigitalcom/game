import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { invitationsRouter } from './routes/invitations.js';
import { rsvpsRouter } from './routes/rsvps.js';
import { authRouter } from './routes/auth.js';
import { rateLimiter } from './middleware/rateLimit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter(300, 60000)); // 300 requests per minute

// API Routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/v1/invitations', invitationsRouter);
app.use('/api/v1/rsvps', rsvpsRouter);
app.use('/api/v1/auth', authRouter);

// Serve frontend static build if in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side React router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 GameInvite SaaS server is running on http://localhost:${PORT}`);
});
