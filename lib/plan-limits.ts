import type { Plan } from "@/lib/generated/prisma/enums";

export const planLimits: Record<Plan, { photos: number; videos: number; conditions: number }> = {
  GRATUITO: { photos: 0, videos: 0, conditions: 3 },
  PREMIUM: { photos: 12, videos: 6, conditions: Infinity },
  DESTAQUE: { photos: 12, videos: 6, conditions: Infinity },
};

export const uploadRules = {
  avatar: { types: ["image/jpeg", "image/png", "image/webp"], maxMb: 5, private: false },
  photo: { types: ["image/jpeg", "image/png", "image/webp"], maxMb: 8, private: false },
  video: { types: ["video/mp4", "video/webm", "video/quicktime"], maxMb: 200, private: false },
  document: { types: ["application/pdf", "image/jpeg", "image/png"], maxMb: 10, private: true },
} as const;

export type UploadKind = keyof typeof uploadRules;
