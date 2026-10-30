"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { refreshProfessional } from "@/lib/server/revalidate";

export const replyReview = async (id: string, reply: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const text = reply.trim().slice(0, 1000);
  if (!text) return { error: "Escreva a resposta." };
  const { count } = await db.review.updateMany({ where: { id, professionalId: pro.id, reply: null }, data: { reply: text } });
  if (!count) return { error: "Essa avaliação já tem resposta." };
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const reportReview = async (id: string): Promise<ActionState> => {
  const { user, professional: pro } = await requireProfessional();
  const review = await db.review.findFirst({ where: { id, professionalId: pro.id } });
  if (!review) return { error: "Avaliação não encontrada." };
  if (await db.report.findFirst({ where: { reviewId: id, status: "ABERTA" } })) return { error: "Denúncia já enviada." };
  await db.report.create({ data: { professionalId: pro.id, reviewId: id, reporterId: user.id, reason: "Avaliação contestada pelo profissional" } });
  return { ok: true };
};
