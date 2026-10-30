import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { Accent, Plan, Professional, PublicReview, Vacancy } from "@/lib/types";
import { db } from "./db";

export const professionalInclude = {
  education: { orderBy: { year: "desc" } },
  portfolio: { orderBy: { createdAt: "desc" } },
  photos: { orderBy: { position: "asc" } },
  videos: { orderBy: { position: "asc" } },
  reviews: { where: { hidden: false }, select: { rating: true } },
} satisfies Prisma.ProfessionalInclude;

type Row = Prisma.ProfessionalGetPayload<{ include: typeof professionalInclude }>;

const effectivePlan = (p: Pick<Row, "plan" | "planUntil">) => (p.plan !== "GRATUITO" && p.planUntil && p.planUntil < new Date() ? "GRATUITO" : p.plan);

export const toProfessional = (p: Row): Professional => {
  const ratings = p.reviews.map((r) => r.rating);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    specialty: p.specialty,
    council: p.councilName && p.councilNumber ? { name: p.councilName, number: p.councilNumber, uf: p.councilUf ?? "" } : null,
    city: p.city,
    neighborhood: p.neighborhood,
    plan: effectivePlan(p).toLowerCase() as Plan,
    bio: p.bio,
    years: p.years,
    gender: p.gender,
    conditions: p.conditions,
    ageRanges: p.ageRanges,
    approaches: p.approaches,
    modalities: p.modalities,
    healthPlans: p.healthPlans,
    price: p.price,
    vacancy: p.vacancy.toLowerCase() as Vacancy,
    rating: ratings.length >= 3 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
    reviewsCount: ratings.length,
    responseHours: p.responseHours,
    languages: p.languages,
    education: p.education,
    portfolio: p.portfolio,
    whatsapp: p.whatsapp,
    whatsappMessage: p.whatsappMessage,
    accent: p.accent as Accent,
    avatarUrl: p.avatarUrl,
    social: {
      instagram: p.instagram ?? undefined,
      youtube: p.youtube ?? undefined,
      tiktok: p.tiktok ?? undefined,
      linkedin: p.linkedin ?? undefined,
      site: p.site ?? undefined,
    },
    videos: p.videos.map((v) => ({ id: v.id, kind: v.kind === "UPLOAD" ? "upload" : "youtube", title: v.title, duration: v.duration, url: v.url })),
    photos: p.photos.map((f) => ({ id: f.id, url: f.url, caption: f.caption })),
  };
};

const planWeight = { DESTAQUE: 0, PREMIUM: 1, GRATUITO: 2 } as const;

export const listVerified = async () => {
  "use cache";
  cacheTag("professionals");
  cacheLife("minutes");
  const rows = await db.professional.findMany({ where: { status: "VERIFICADO" }, include: professionalInclude });
  return rows
    .sort((a, b) => planWeight[effectivePlan(a)] - planWeight[effectivePlan(b)] || b.reviews.length - a.reviews.length)
    .map(toProfessional);
};

export const getPublicProfile = async (slug: string) => {
  "use cache";
  cacheTag(`professional:${slug}`);
  cacheLife("minutes");
  const row = await db.professional.findUnique({ where: { slug }, include: professionalInclude });
  if (!row || row.status !== "VERIFICADO") return null;
  const reviews = await db.review.findMany({
    where: { professionalId: row.id, hidden: false },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return {
    pro: toProfessional(row),
    reviews: reviews.map(
      (r): PublicReview => ({
        id: r.id,
        author: shortName(r.author.name),
        date: r.createdAt.toISOString().slice(0, 10),
        rating: r.rating,
        criteria: { acolhimento: r.acolhimento, comunicacao: r.comunicacao, pontualidade: r.pontualidade },
        text: r.text,
        reply: r.reply,
      }),
    ),
  };
};

export const shortName = (name: string) => {
  const [first, ...rest] = name.trim().split(/\s+/);
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
};

export const loadOwnProfessional = async (id: string) =>
  toProfessional(await db.professional.findUniqueOrThrow({ where: { id }, include: professionalInclude }));
