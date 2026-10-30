"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/dal";
import { text } from "@/lib/server/form";
import { refreshProfessional } from "@/lib/server/revalidate";

const decisions = { approve: "VERIFICADO", correction: "CORRECAO", reject: "REJEITADO" } as const;

export const decide = async (id: string, _: ActionState, data: FormData): Promise<ActionState> => {
  await requireAdmin();
  const decision = text(data, "decision") as keyof typeof decisions;
  const note = text(data, "note").slice(0, 500) || null;
  if (!decisions[decision]) return { error: "Decisão inválida." };
  if (decision !== "approve" && !note) return { error: "Explique o motivo para o profissional." };
  const pro = await db.professional.update({ where: { id }, data: { status: decisions[decision], statusNote: decision === "approve" ? null : note } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const startReview = async (id: string): Promise<ActionState> => {
  await requireAdmin();
  await db.professional.updateMany({ where: { id, status: "ENVIADO" }, data: { status: "EM_ANALISE" } });
  return { ok: true };
};

export const toggleEducation = async (id: string): Promise<ActionState> => {
  await requireAdmin();
  const e = await db.education.findUniqueOrThrow({ where: { id }, include: { professional: { select: { slug: true } } } });
  await db.education.update({ where: { id }, data: { verified: !e.verified } });
  refreshProfessional(e.professional.slug);
  return { ok: true };
};

export const resolveReport = async (id: string): Promise<ActionState> => {
  await requireAdmin();
  await db.report.update({ where: { id }, data: { status: "RESOLVIDA" } });
  return { ok: true };
};

export const hideReported = async (id: string): Promise<ActionState> => {
  await requireAdmin();
  const report = await db.report.update({ where: { id }, data: { status: "OCULTO" }, include: { professional: { select: { id: true, slug: true } } } });
  if (report.reviewId) await db.review.update({ where: { id: report.reviewId }, data: { hidden: true } });
  else await db.professional.update({ where: { id: report.professional.id }, data: { status: "CORRECAO", statusNote: `Perfil oculto pela moderação: ${report.reason}.` } });
  refreshProfessional(report.professional.slug);
  return { ok: true };
};
