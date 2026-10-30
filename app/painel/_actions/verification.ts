"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { optional, text } from "@/lib/server/form";
import { removeObject } from "@/lib/server/r2";
import { refreshProfessional } from "@/lib/server/revalidate";

const kinds = ["Conselho", "Identidade", "Formação"];
const locked = ["ENVIADO", "EM_ANALISE"];

export const saveCouncil = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (locked.includes(pro.status)) return { error: "Aguarde a análise terminar para alterar o registro." };
  const councilName = optional(data, "councilName");
  const councilNumber = optional(data, "councilNumber");
  const councilUf = optional(data, "councilUf")?.toUpperCase().slice(0, 2) ?? null;
  if (councilName && (!councilNumber || !councilUf)) return { error: "Informe número e UF do registro." };
  const changed = councilName !== pro.councilName || councilNumber !== pro.councilNumber || councilUf !== pro.councilUf;
  await db.professional.update({
    where: { id: pro.id },
    data: { councilName, councilNumber, councilUf, status: changed && pro.status === "VERIFICADO" ? "EM_ANALISE" : undefined },
  });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const addDocument = async (key: string, kind: string, fileName: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (!key.startsWith(`profiles/${pro.id}/document/`) || key.includes("..") || !kinds.includes(kind)) return { error: "Documento inválido." };
  await db.document.create({ data: { professionalId: pro.id, key, kind, fileName: fileName.slice(0, 120) } });
  return { ok: true };
};

export const removeDocument = async (id: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (locked.includes(pro.status)) return { error: "Documentos não podem ser removidos durante a análise." };
  const doc = await db.document.findFirst({ where: { id, professionalId: pro.id } });
  if (!doc) return { error: "Documento não encontrado." };
  await db.document.delete({ where: { id } });
  await removeObject(doc.key, true);
  return { ok: true };
};

export const addEducation = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const title = text(data, "title");
  const institution = text(data, "institution");
  const year = Number(text(data, "year"));
  if (title.length < 3 || institution.length < 2 || !(year >= 1950 && year <= new Date().getFullYear() + 1)) return { error: "Preencha curso, instituição e ano." };
  await db.education.create({ data: { professionalId: pro.id, title, institution, year } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const removeEducation = async (id: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  await db.education.deleteMany({ where: { id, professionalId: pro.id } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const submitForReview = async (): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (!["RASCUNHO", "CORRECAO", "REJEITADO"].includes(pro.status)) return { error: "Seu perfil já está em análise ou verificado." };
  const docs = await db.document.findMany({ where: { professionalId: pro.id }, select: { kind: true } });
  if (!docs.some((d) => d.kind === "Identidade")) return { error: "Envie um documento de identidade com foto." };
  if (!docs.some((d) => d.kind === (pro.councilName ? "Conselho" : "Formação")))
    return { error: pro.councilName ? "Envie o comprovante do registro no conselho." : "Envie o certificado da sua formação." };
  if (!pro.city || pro.bio.length < 50) return { error: "Preencha cidade (Atendimento) e uma bio com pelo menos 50 caracteres (Meu perfil)." };
  await db.professional.update({ where: { id: pro.id }, data: { status: "ENVIADO", submittedAt: new Date(), statusNote: null } });
  return { ok: true };
};
