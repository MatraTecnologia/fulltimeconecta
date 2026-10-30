import "server-only";
import { db } from "./db";

const DAY = 864e5;

export const reviewEligibility = async (professionalId: string, userId: string) => {
  const [lead, existing] = await Promise.all([
    db.lead.findFirst({ where: { professionalId, familyId: userId }, orderBy: { createdAt: "asc" } }),
    db.review.findUnique({ where: { professionalId_authorId: { professionalId, authorId: userId } } }),
  ]);
  if (existing) return "reviewed" as const;
  if (!lead) return "no-contact" as const;
  if (Date.now() - lead.createdAt.getTime() < 7 * DAY) return { waitUntil: new Date(lead.createdAt.getTime() + 7 * DAY) };
  return "eligible" as const;
};
