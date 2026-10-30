"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { modalities } from "@/lib/catalog";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { getUser } from "@/lib/server/dal";
import { text } from "@/lib/server/form";
import { refreshProfessional } from "@/lib/server/revalidate";
import { reviewEligibility } from "@/lib/server/reviews";

const DAY = 864e5;

const findVerified = (slug: string) => db.professional.findFirst({ where: { slug, status: "VERIFICADO" }, select: { id: true, slug: true } });

const leadSchema = z.object({
  guardian: z.string().min(3, "Informe seu nome").max(80),
  contact: z.string().min(8, "Informe telefone ou e-mail").max(120),
  personAge: z.string().min(1, "Informe a idade").max(30),
  modality: z.enum(modalities).nullable(),
  message: z.string().max(500),
});

export const sendLead = async (slug: string, _: ActionState, data: FormData): Promise<ActionState> => {
  if (text(data, "website")) return { ok: true };
  const pro = await findVerified(slug);
  if (!pro) return { error: "Perfil indisponível." };
  const parsed = leadSchema.safeParse({
    guardian: text(data, "guardian"),
    contact: text(data, "contact"),
    personAge: text(data, "personAge"),
    modality: text(data, "modality") || null,
    message: text(data, "message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const recent = await db.lead.findFirst({ where: { professionalId: pro.id, contact: parsed.data.contact, createdAt: { gte: new Date(Date.now() - DAY) } } });
  if (recent) return { error: "Você já enviou uma solicitação nas últimas 24 h." };
  const user = await getUser();
  await db.$transaction([
    db.lead.create({ data: { ...parsed.data, professionalId: pro.id, channel: "FORMULARIO", familyId: user?.role === "familia" ? user.id : null } }),
    db.event.create({ data: { professionalId: pro.id, type: "LEAD" } }),
  ]);
  return { ok: true };
};

export const trackView = async (slug: string) => {
  const jar = await cookies();
  const name = `v_${slug}`.slice(0, 60);
  if (jar.get(name)) return;
  const pro = await findVerified(slug);
  if (!pro) return;
  await db.event.create({ data: { professionalId: pro.id, type: "VIEW" } });
  jar.set(name, "1", { maxAge: 60 * 60 * 12, httpOnly: true, sameSite: "lax", path: "/" });
};

const reasons = ["Promessa de cura", "Registro falso", "Conteúdo impróprio", "Dados de terceiros", "Outro"];

export const reportProfile = async (slug: string, _: ActionState, data: FormData): Promise<ActionState> => {
  const user = await getUser();
  if (!user) return { error: "Entre na sua conta para denunciar." };
  const pro = await findVerified(slug);
  if (!pro) return { error: "Perfil indisponível." };
  const reason = text(data, "reason");
  if (!reasons.includes(reason)) return { error: "Selecione o motivo." };
  if (await db.report.findFirst({ where: { professionalId: pro.id, reporterId: user.id, reviewId: null, status: "ABERTA" } }))
    return { error: "Você já denunciou este perfil. A moderação está analisando." };
  await db.report.create({ data: { professionalId: pro.id, reporterId: user.id, reason, details: text(data, "details").slice(0, 500) } });
  const reporters = await db.report.findMany({
    where: { professionalId: pro.id, reviewId: null, status: "ABERTA", reporterId: { not: null }, createdAt: { gte: new Date(Date.now() - 30 * DAY) } },
    distinct: ["reporterId"],
    select: { reporterId: true },
  });
  if (reporters.length >= 3) {
    await db.professional.update({ where: { id: pro.id }, data: { status: "CORRECAO", statusNote: "Perfil oculto preventivamente após denúncias. A moderação vai entrar em contato." } });
    refreshProfessional(pro.slug);
  }
  return { ok: true };
};

const score = z.coerce.number().int().min(1).max(5);
const reviewSchema = z.object({
  acolhimento: score,
  comunicacao: score,
  pontualidade: score,
  text: z.string().min(20, "Escreva pelo menos 20 caracteres").max(1000),
});

export const submitReview = async (slug: string, _: ActionState, data: FormData): Promise<ActionState> => {
  const user = await getUser();
  if (user?.role !== "familia") return { error: "Só contas de família podem avaliar." };
  const pro = await findVerified(slug);
  if (!pro) return { error: "Perfil indisponível." };
  if ((await reviewEligibility(pro.id, user.id)) !== "eligible") return { error: "Você ainda não pode avaliar este profissional." };
  const parsed = reviewSchema.safeParse({
    acolhimento: text(data, "acolhimento"),
    comunicacao: text(data, "comunicacao"),
    pontualidade: text(data, "pontualidade"),
    text: text(data, "text"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;
  await db.review.create({
    data: { ...v, professionalId: pro.id, authorId: user.id, rating: Math.round((v.acolhimento + v.comunicacao + v.pontualidade) / 3) },
  });
  refreshProfessional(pro.slug);
  return { ok: true };
};
