import "server-only";
import { db } from "./db";

const DAY = 864e5;

const countByType = async (professionalId: string, from: Date, to: Date) => {
  const rows = await db.event.groupBy({ by: ["type"], where: { professionalId, createdAt: { gte: from, lt: to } }, _count: true });
  const get = (t: "VIEW" | "WHATSAPP" | "LEAD") => rows.find((r) => r.type === t)?._count ?? 0;
  return { views: get("VIEW"), clicks: get("WHATSAPP"), leads: get("LEAD") };
};

export const last30 = async (professionalId: string) => {
  const now = new Date();
  const [current, previous] = await Promise.all([
    countByType(professionalId, new Date(now.getTime() - 30 * DAY), now),
    countByType(professionalId, new Date(now.getTime() - 60 * DAY), new Date(now.getTime() - 30 * DAY)),
  ]);
  return { current, previous };
};

export const delta = (current: number, previous: number) => (previous ? `${current >= previous ? "+" : ""}${Math.round(((current - previous) / previous) * 100)}% vs. 30 dias anteriores` : undefined);

const weekLabel = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");

export const weekly = async (professionalId: string, weeks = 8) => {
  const end = new Date();
  const start = new Date(end.getTime() - weeks * 7 * DAY);
  const events = await db.event.findMany({ where: { professionalId, createdAt: { gte: start } }, select: { type: true, createdAt: true } });
  const buckets = Array.from({ length: weeks }, (_, i) => ({ week: weekLabel(new Date(start.getTime() + i * 7 * DAY)), views: 0, clicks: 0, leads: 0 }));
  for (const e of events) {
    const b = buckets[Math.min(weeks - 1, Math.floor((e.createdAt.getTime() - start.getTime()) / (7 * DAY)))];
    if (e.type === "VIEW") b.views++;
    else if (e.type === "WHATSAPP") b.clicks++;
    else b.leads++;
  }
  return buckets;
};
