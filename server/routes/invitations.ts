import { Router, Request, Response } from 'express';

export const invitationsRouter = Router();

// In-memory persistent database store (with initial sample data)
let invitationsDb: any[] = [
  {
    id: 'demo-raka',
    creatorId: 'user-demo',
    slug: 'raka-7th-birthday',
    childName: 'Raka Pratama',
    age: '7',
    eventDate: '2026-12-20',
    eventTime: '10:00 - 13:00 WIB',
    locationName: 'Wonderland Kids Cafe, Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Wonderland+Kids+Cafe',
    avatar: '🦖',
    openingMessage: 'Hai kawan-kawan! Selesaikan tantangan game seru ini dulu untuk membuka kartu undangan pesta ulang tahunku yang ke-7!',
    gameGenre: 'treasure_hunt',
    difficulty: 'normal',
    targetGoal: 3,
    colorTheme: 'indigo',
    whatsapp: '6281234567890',
    allowWishes: true,
    isPublished: true,
    viewCount: 142,
    playCount: 118,
    winCount: 96,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000
  }
];

// GET /api/v1/invitations - List all invitations for user
invitationsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: invitationsDb
  });
});

// GET /api/v1/invitations/:identifier - Get single invitation by ID or Slug
invitationsRouter.get('/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const found = invitationsDb.find((i) => i.id === identifier || i.slug === identifier);
  if (!found) {
    return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan' });
  }
  // Increment view count
  found.viewCount = (found.viewCount || 0) + 1;
  res.json({ success: true, data: found });
});

// POST /api/v1/invitations - Create or update invitation
invitationsRouter.post('/', (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload.childName || !payload.age || !payload.locationName) {
    return res.status(400).json({ success: false, error: 'Data nama, usia, dan lokasi wajib diisi' });
  }

  if (payload.id) {
    const idx = invitationsDb.findIndex((i) => i.id === payload.id);
    if (idx !== -1) {
      invitationsDb[idx] = { ...invitationsDb[idx], ...payload, updatedAt: Date.now() };
      return res.json({ success: true, data: invitationsDb[idx] });
    }
  }

  const newId = 'inv-' + Date.now();
  const slug = (payload.childName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(100 + Math.random() * 900));
  const newInvite = {
    ...payload,
    id: newId,
    slug: payload.slug || slug,
    viewCount: 0,
    playCount: 0,
    winCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  invitationsDb.unshift(newInvite);
  res.status(201).json({ success: true, data: newInvite });
});

// DELETE /api/v1/invitations/:id - Delete invitation
invitationsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  invitationsDb = invitationsDb.filter((i) => i.id !== id);
  res.json({ success: true, message: 'Undangan berhasil dihapus' });
});
