import "server-only";
import { db } from "./db";

export const listRetainedLeads = (professionalId: string) =>
  db.lead.findMany({ where: { professionalId, createdAt: { gte: new Date(Date.now() - 365 * 864e5) } }, orderBy: { createdAt: "desc" } });
