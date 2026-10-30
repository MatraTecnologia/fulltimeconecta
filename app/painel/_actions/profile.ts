"use server";

import { z } from "zod";
import { ageRanges, approaches, conditions, healthPlans, modalities, specialties } from "@/lib/catalog";
import { planLimits } from "@/lib/plan-limits";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { int, list, optional, text } from "@/lib/server/form";
import { refreshProfessional } from "@/lib/server/revalidate";

const handle = (v: string | null) => v?.replace(/^@/, "").replace(/^https?:\/\//, "").replace(/\/$/, "") || null;
const pick = (values: string[], allowed: readonly string[]) => values.filter((v) => allowed.includes(v));

const profileSchema = z.object({
  name: z.string().min(3, "Informe o nome de exibição"),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Endereço só pode ter letras minúsculas, números e hífen").min(3).max(60),
  specialty: z.enum(specialties, "Especialidade inválida"),
  bio: z.string().max(1500, "Máximo de 1.500 caracteres"),
  years: z.number().int().min(0).max(70),
  whatsapp: z.string().regex(/^\d{12,13}$/, "WhatsApp com DDI e DDD, ex.: 5543999990000"),
});

export const saveProfile = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const parsed = profileSchema.safeParse({
    name: text(data, "name"),
    slug: text(data, "slug").toLowerCase(),
    specialty: text(data, "specialty"),
    bio: text(data, "bio"),
    years: int(data, "years") ?? 0,
    whatsapp: text(data, "whatsapp").replace(/\D/g, ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;

  const slugChanged = v.slug !== pro.slug;
  if (slugChanged) {
    if (pro.slugChangedAt && Date.now() - pro.slugChangedAt.getTime() < 30 * 864e5) return { error: "O endereço do perfil só pode mudar 1 vez a cada 30 dias." };
    if (await db.professional.findUnique({ where: { slug: v.slug } })) return { error: "Esse endereço já está em uso." };
  }
  const specialtyChanged = v.specialty !== pro.specialty && pro.status === "VERIFICADO";

  await db.professional.update({
    where: { id: pro.id },
    data: {
      ...v,
      slugChangedAt: slugChanged ? new Date() : undefined,
      status: specialtyChanged ? "EM_ANALISE" : undefined,
      languages: text(data, "languages").split(",").map((s) => s.trim()).filter(Boolean),
      whatsappMessage: optional(data, "whatsappMessage"),
      instagram: handle(optional(data, "instagram")),
      youtube: handle(optional(data, "youtube")),
      tiktok: handle(optional(data, "tiktok")),
      linkedin: handle(optional(data, "linkedin")),
      site: handle(optional(data, "site")),
    },
  });
  refreshProfessional(pro.slug);
  if (slugChanged) refreshProfessional(v.slug);
  return { ok: true };
};

export const saveAtendimento = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const vacancy = text(data, "vacancy").toUpperCase();
  if (!["ABERTA", "ESPERA", "FECHADA"].includes(vacancy)) return { error: "Selecione a situação das vagas." };
  const conds = pick(list(data, "conditions"), conditions);
  if (conds.length > planLimits[pro.plan].conditions) return { error: `Seu plano permite até ${planLimits[pro.plan].conditions} condições.` };

  await db.professional.update({
    where: { id: pro.id },
    data: {
      vacancy: vacancy as "ABERTA" | "ESPERA" | "FECHADA",
      conditions: conds,
      ageRanges: pick(list(data, "ageRanges"), ageRanges),
      approaches: pick(list(data, "approaches"), approaches),
      modalities: pick(list(data, "modalities"), modalities),
      healthPlans: pick(list(data, "healthPlans"), healthPlans),
      price: int(data, "price"),
      city: text(data, "city"),
      neighborhood: text(data, "neighborhood"),
      address: optional(data, "address"),
    },
  });
  refreshProfessional(pro.slug);
  return { ok: true };
};
