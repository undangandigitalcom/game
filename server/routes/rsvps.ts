import { Router, Request, Response } from 'express';

export const rsvpsRouter = Router();

let rsvpsDb: any[] = [
  {
    id: 'rsvp-1',
    inviteId: 'demo-raka',
    guestName: 'Keluarga Dimas & Arka',
    attending: 'Hadir',
    message: 'Selamat ulang tahun Raka! Semoga makin pintar dan jadi jagoan hebat!',
    createdAt: Date.now() - 86400000 * 2
  }
];

// GET /api/v1/rsvps/:inviteId - List RSVPs for an invitation
rsvpsRouter.get('/:inviteId', (req: Request, res: Response) => {
  const { inviteId } = req.params;
  const list = rsvpsDb.filter((r) => r.inviteId === inviteId);
  res.json({ success: true, data: list });
});

// POST /api/v1/rsvps - Submit an RSVP
rsvpsRouter.post('/', (req: Request, res: Response) => {
  const { inviteId, guestName, attending, message } = req.body;
  if (!inviteId || !guestName || !attending) {
    return res.status(400).json({ success: false, error: 'Data nama dan status kehadiran wajib diisi' });
  }

  const newRsvp = {
    id: 'rsvp-' + Date.now(),
    inviteId,
    guestName: guestName.trim(),
    attending,
    message: message ? message.trim() : '',
    createdAt: Date.now()
  };

  rsvpsDb.unshift(newRsvp);
  res.status(201).json({ success: true, data: newRsvp });
});
