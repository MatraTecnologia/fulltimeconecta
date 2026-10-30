"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { refreshProfessional } from "@/lib/server/revalidate";

const offers = {
  "premium-mensal": { item: "Premium mensal", amount: 5990, days: 30, plan: "PREMIUM" },
  "premium-anual": { item: "Premium anual", amount: 49900, days: 365, plan: "PREMIUM" },
  destaque: { item: "Destaque 7 dias", amount: 3990, days: 7, plan: "DESTAQUE" },
} as const;

export const buyPlan = async (offer: keyof typeof offers): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const o = offers[offer];
  if (!o) return { error: "Oferta inválida." };
  if (pro.status !== "VERIFICADO") return { error: "Os planos ficam disponíveis depois que seu perfil for verificado." };
  const base = pro.planUntil && pro.planUntil > new Date() ? pro.planUntil : new Date();
  const planUntil = new Date(base.getTime() + o.days * 864e5);
  const plan = pro.plan === "DESTAQUE" || o.plan === "DESTAQUE" ? "DESTAQUE" : "PREMIUM";
  await db.$transaction([
    db.order.create({ data: { professionalId: pro.id, item: o.item, amount: o.amount, method: "Simulado", status: "Pago" } }),
    db.professional.update({ where: { id: pro.id }, data: { plan, planUntil } }),
  ]);
  refreshProfessional(pro.slug);
  return { ok: true };
};
