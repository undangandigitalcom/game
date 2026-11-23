import { Router, Request, Response } from 'express';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email wajib diisi' });
  }

  res.json({
    success: true,
    user: {
      id: 'user-' + Date.now(),
      name: name || 'Creator',
      email,
      plan: 'pro'
    },
    token: 'jwt-gameinvite-session-token-' + Date.now()
  });
});
