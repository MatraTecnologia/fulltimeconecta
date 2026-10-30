"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { specialties } from "@/lib/catalog";
import type { ActionState } from "@/lib/action-state";
import { auth } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { text } from "@/lib/server/form";

const safeNext = (v: string) => (v.startsWith("/") && !v.startsWith("//") ? v : null);

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^(dr|dra)\.?\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "profissional";

const uniqueSlug = async (name: string) => {
  const base = slugify(name);
  for (let i = 0; ; i++) {
    const slug = i ? `${base}-${i + 1}` : base;
    if (!(await db.professional.findUnique({ where: { slug }, select: { id: true } }))) return slug;
  }
};

const authError = (e: unknown) => {
  if (!(e instanceof APIError)) throw e;
  const code = (e.body as { code?: string } | undefined)?.code;
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "Já existe uma conta com esse e-mail.";
  if (code === "INVALID_EMAIL_OR_PASSWORD") return "E-mail ou senha incorretos.";
  if (code === "PASSWORD_TOO_SHORT") return "A senha precisa ter pelo menos 8 caracteres.";
  return e.message || "Não foi possível concluir. Tente novamente.";
};

const account = z.object({
  name: z.string().min(3, "Informe seu nome completo"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
});

export const signIn = async (_: ActionState, data: FormData): Promise<ActionState> => {
  let role: string;
  try {
    const res = await auth.api.signInEmail({ body: { email: text(data, "email"), password: String(data.get("password") ?? "") }, headers: await headers() });
    role = (res.user as { role?: string }).role ?? "familia";
  } catch (e) {
    return { error: authError(e) };
  }
  redirect(safeNext(text(data, "next")) ?? (role === "admin" ? "/admin" : role === "profissional" ? "/painel" : "/"));
};

export const signUpFamily = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const parsed = account.safeParse({ name: text(data, "name"), email: text(data, "email"), password: String(data.get("password") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (data.get("terms") !== "on") return { error: "Aceite os termos para continuar." };
  try {
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (e) {
    return { error: authError(e) };
  }
  redirect(safeNext(text(data, "next")) ?? "/");
};

export const signUpProfessional = async (_: ActionState, data: FormData): Promise<ActionState> => {
  const parsed = account.safeParse({ name: text(data, "name"), email: text(data, "email"), password: String(data.get("password") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (text(data, "email") !== text(data, "email2")) return { error: "Os e-mails não conferem." };
  const specialty = text(data, "specialty");
  if (!(specialties as readonly string[]).includes(specialty)) return { error: "Selecione a especialidade." };
  if (data.get("terms") !== "on") return { error: "Aceite os termos para continuar." };
  const council = text(data, "council");
  const hasCouncil = council && !council.startsWith("Sem conselho");
  if (hasCouncil && !text(data, "councilNumber")) return { error: "Informe o número do registro no conselho." };

  let userId: string;
  try {
    const res = await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
    userId = res.user.id;
  } catch (e) {
    return { error: authError(e) };
  }
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { role: "profissional" } }),
    db.professional.create({
      data: {
        userId,
        slug: await uniqueSlug(parsed.data.name),
        name: parsed.data.name,
        specialty,
        councilName: hasCouncil ? council : null,
        councilNumber: hasCouncil ? text(data, "councilNumber") : null,
        councilUf: hasCouncil ? text(data, "councilUf") : null,
        accent: ["teal", "coral", "amber", "lilac", "sky", "sage"][Math.floor(Math.random() * 6)],
      },
    }),
  ]);
  redirect("/painel/verificacao");
};
