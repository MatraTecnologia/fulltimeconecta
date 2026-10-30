"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";

const statuses = ["NOVO", "RESPONDIDO", "CONVERTIDO", "DESCARTADO"] as const;

export const setLeadStatus = async (id: string, status: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (!(statuses as readonly string[]).includes(status)) return { error: "Status inválido." };
  await db.lead.updateMany({ where: { id, professionalId: pro.id }, data: { status: status as (typeof statuses)[number] } });
  return { ok: true };
};
