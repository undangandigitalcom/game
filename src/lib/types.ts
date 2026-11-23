// ==========================================
// Tipe Data Master untuk GameInvite SaaS
// ==========================================

export type GameGenreId =
  | 'treasure_hunt'
  | 'jungle_runner'
  | 'super_platformer'
  | 'dino_escape'
  | 'space_mission'
  | 'puzzle_master'
  | 'castle_defender'
  | 'memory_quest';

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export type UserPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  avatar?: string;
  createdAt: number;
}

export interface GameThemeStyle {
  bg: string;
  card: string;
  accent: string;
  fontStyle: string;
}

export interface GameGenre {
  id: GameGenreId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  emoji: string;
  badgeColor: string;
  themeStyle: GameThemeStyle;
  controlsHint: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  bg: string;
  light: string;
}

export interface Invitation {
  id: string;
  creatorId: string;
  slug: string;
  childName: string;
  age: string | number;
  eventDate: string;
  eventTime: string;
  locationName: string;
  mapsUrl?: string;
  avatar: string;
  openingMessage: string;
  gameGenre: GameGenreId;
  difficulty: DifficultyLevel;
  targetGoal: number;
  colorTheme: string;
  whatsapp?: string;
  allowWishes: boolean;
  isPublished: boolean;
  viewCount: number;
  playCount: number;
  winCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface RSVPResponse {
  id: string;
  inviteId: string;
  guestName: string;
  attending: 'Hadir' | 'Tidak Hadir';
  message: string;
  createdAt: number;
}

export interface PlanFeature {
  id: UserPlan;
  name: string;
  badge?: string;
  priceFormatted: string;
  period: string;
  description: string;
  features: string[];
  maxInvitations: number;
  unlimitedRSVP: boolean;
  allGenres: boolean;
  customBranding: boolean;
  analytics: boolean;
  popular?: boolean;
}
