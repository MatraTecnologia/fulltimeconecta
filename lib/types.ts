export type Plan = "gratuito" | "premium" | "destaque";
export type Vacancy = "aberta" | "espera" | "fechada";
export type Accent = "teal" | "coral" | "amber" | "lilac" | "sky" | "sage";

export type Social = { instagram?: string; youtube?: string; tiktok?: string; linkedin?: string; site?: string };
export type Video = { id?: string; kind: "youtube" | "upload"; title: string; duration: string | null; url: string | null };
export type Photo = { id: string; url: string; caption: string };

export type Professional = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  council: { name: string; number: string; uf: string } | null;
  city: string;
  neighborhood: string;
  plan: Plan;
  bio: string;
  years: number;
  gender: string | null;
  conditions: string[];
  ageRanges: string[];
  approaches: string[];
  modalities: string[];
  healthPlans: string[];
  price: number | null;
  vacancy: Vacancy;
  rating: number | null;
  reviewsCount: number;
  responseHours: number;
  languages: string[];
  education: { title: string; institution: string; year: number; verified: boolean }[];
  portfolio: { id: string; type: string; title: string; detail: string }[];
  whatsapp: string;
  whatsappMessage: string | null;
  accent: Accent;
  avatarUrl: string | null;
  social: Social;
  videos: Video[];
  photos: Photo[];
};

export type PublicReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  criteria: { acolhimento: number; comunicacao: number; pontualidade: number };
  text: string;
  reply: string | null;
};
