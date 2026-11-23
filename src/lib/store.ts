import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Invitation, RSVPResponse, UserPlan } from './types';

// ==========================================
// STATE MANAGEMENT (ZUSTAND STORE)
// Mendukung penyimpanan lokal (LocalStorage) dengan sinkronisasi otomatis
// Siap dihubungkan ke backend REST API ataupun Supabase
// ==========================================

const SEED_INVITATIONS: Invitation[] = [
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
  },
  {
    id: 'demo-alina',
    creatorId: 'user-demo',
    slug: 'alina-princess-quest',
    childName: 'Alina Zahra',
    age: '5',
    eventDate: '2026-12-25',
    eventTime: '15:30 - 18:00 WIB',
    locationName: 'Grand Royal Hall, Jakarta Selatan',
    mapsUrl: 'https://maps.google.com/?q=Grand+Royal+Hall',
    avatar: '👸',
    openingMessage: 'Selamat datang di Kerajaan Bintang Alina! Cocokkan kartu ingatan ajaib untuk menghadiri pesta dansa!',
    gameGenre: 'memory_quest',
    difficulty: 'easy',
    targetGoal: 4,
    colorTheme: 'rose',
    whatsapp: '6289876543210',
    allowWishes: true,
    isPublished: true,
    viewCount: 88,
    playCount: 76,
    winCount: 65,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2
  }
];

const SEED_RSVPS: RSVPResponse[] = [
  {
    id: 'rsvp-1',
    inviteId: 'demo-raka',
    guestName: 'Keluarga Dimas & Arka',
    attending: 'Hadir',
    message: 'Selamat ulang tahun Raka! Semoga makin pintar dan jadi jagoan hebat!',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'rsvp-2',
    inviteId: 'demo-raka',
    guestName: 'Tante Maya & Kenzo',
    attending: 'Hadir',
    message: 'Happy 7th birthday Raka! Siap datang dan main game seru!',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'rsvp-3',
    inviteId: 'demo-raka',
    guestName: 'Om Danu & Kevin',
    attending: 'Tidak Hadir',
    message: 'Maaf Raka, Kevin ada lomba renang di hari yang sama. Doa terbaik buat Raka ya!',
    createdAt: Date.now() - 3600000 * 12
  }
];

interface AppState {
  user: User | null;
  invitations: Invitation[];
  rsvps: RSVPResponse[];
  currentInvite: Invitation | null;
  soundEnabled: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  login: (name: string, email: string) => void;
  logout: () => void;
  setPlan: (plan: UserPlan) => void;
  setSoundEnabled: (enabled: boolean) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Invitation Actions
  getInvitationBySlugOrId: (identifier: string) => Invitation | undefined;
  saveInvitation: (inv: Partial<Invitation>) => Invitation;
  deleteInvitation: (id: string) => void;
  incrementStats: (id: string, metric: 'view' | 'play' | 'win') => void;

  // RSVP Actions
  getRSVPsByInviteId: (inviteId: string) => RSVPResponse[];
  addRSVP: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>) => RSVPResponse;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-demo',
        name: 'Bunda Sarah',
        email: 'sarah.pratama@example.com',
        plan: 'pro',
        createdAt: Date.now() - 86400000 * 30
      },
      invitations: SEED_INVITATIONS,
      rsvps: SEED_RSVPS,
      currentInvite: null,
      soundEnabled: true,
      toastMessage: null,

      login: (name, email) => {
        set({
          user: {
            id: 'user-' + Date.now(),
            name,
            email,
            plan: 'pro',
            createdAt: Date.now()
          }
        });
      },

      logout: () => {
        set({ user: null });
      },

      setPlan: (plan) => {
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null
        }));
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      showToast: (text, type = 'info') => {
        set({ toastMessage: { text, type } });
      },

      clearToast: () => set({ toastMessage: null }),

      getInvitationBySlugOrId: (identifier) => {
        const { invitations } = get();
        return invitations.find((i) => i.id === identifier || i.slug === identifier);
      },

      saveInvitation: (draft) => {
        const { invitations, user } = get();
        let target: Invitation;

        if (draft.id) {
          const index = invitations.findIndex((i) => i.id === draft.id);
          if (index !== -1) {
            target = {
              ...invitations[index],
              ...draft,
              updatedAt: Date.now()
            } as Invitation;
            const updated = [...invitations];
            updated[index] = target;
            set({ invitations: updated });
            return target;
          }
        }

        // Create new
        const newId = 'inv-' + Date.now();
        const slug = (draft.childName ? draft.childName.toLowerCase().replace(/\s+/g, '-') : 'party') + '-' + Math.floor(100 + Math.random() * 900);
        target = {
          id: newId,
          creatorId: user?.id || 'guest',
          slug: draft.slug || slug,
          childName: draft.childName || 'Nama Anak',
          age: draft.age || '7',
          eventDate: draft.eventDate || '2026-12-20',
          eventTime: draft.eventTime || '10:00 - 13:00 WIB',
          locationName: draft.locationName || 'Lokasi Acara',
          mapsUrl: draft.mapsUrl || '',
          avatar: draft.avatar || '🎂',
          openingMessage: draft.openingMessage || 'Ayo menangkan game untuk membuka undangan!',
          gameGenre: draft.gameGenre || 'treasure_hunt',
          difficulty: draft.difficulty || 'normal',
          targetGoal: draft.targetGoal || 3,
          colorTheme: draft.colorTheme || 'indigo',
          whatsapp: draft.whatsapp || '',
          allowWishes: draft.allowWishes !== false,
          isPublished: draft.isPublished !== false,
          viewCount: 0,
          playCount: 0,
          winCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...draft
        } as Invitation;

        set({ invitations: [target, ...invitations] });
        return target;
      },

      deleteInvitation: (id) => {
        set((state) => ({
          invitations: state.invitations.filter((i) => i.id !== id),
          rsvps: state.rsvps.filter((r) => r.inviteId !== id)
        }));
      },

      incrementStats: (id, metric) => {
        set((state) => ({
          invitations: state.invitations.map((inv) => {
            if (inv.id !== id && inv.slug !== id) return inv;
            return {
              ...inv,
              viewCount: metric === 'view' ? inv.viewCount + 1 : inv.viewCount,
              playCount: metric === 'play' ? inv.playCount + 1 : inv.playCount,
              winCount: metric === 'win' ? inv.winCount + 1 : inv.winCount
            };
          })
        }));
      },

      getRSVPsByInviteId: (inviteId) => {
        return get().rsvps.filter((r) => r.inviteId === inviteId);
      },

      addRSVP: (rsvpData) => {
        const newRsvp: RSVPResponse = {
          ...rsvpData,
          id: 'rsvp-' + Date.now(),
          createdAt: Date.now()
        };
        set((state) => ({
          rsvps: [newRsvp, ...state.rsvps]
        }));
        return newRsvp;
      }
    }),
    {
      name: 'gameinvite-saas-storage'
    }
  )
);
