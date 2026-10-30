"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { auth } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { removeObject } from "@/lib/server/r2";
import { refreshProfessional } from "@/lib/server/revalidate";

export const deleteAccount = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const { user, professional: pro } = await requireProfessional();
  if (String(data.get("confirm")) !== "EXCLUIR") return { error: "Digite EXCLUIR para confirmar." };
  const [photos, videos, docs] = await Promise.all([
    db.photo.findMany({ where: { professionalId: pro.id }, select: { key: true } }),
    db.video.findMany({ where: { professionalId: pro.id, key: { not: null } }, select: { key: true } }),
    db.document.findMany({ where: { professionalId: pro.id }, select: { key: true } }),
  ]);
  await Promise.allSettled([
    ...photos.map((p) => removeObject(p.key)),
    ...videos.map((v) => removeObject(v.key!)),
    ...docs.map((d) => removeObject(d.key, true)),
    ...(pro.avatarUrl ? [removeObject(pro.avatarUrl.slice(pro.avatarUrl.indexOf("profiles/")))] : []),
  ]);
  await auth.api.signOut({ headers: await headers() });
  await db.user.delete({ where: { id: user.id } });
  refreshProfessional(pro.slug);
  redirect("/");
};
