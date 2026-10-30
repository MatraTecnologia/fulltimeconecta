import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Role } from "./auth";
import { db } from "./db";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export const getUser = async () => {
  const session = await getSession();
  if (!session) return null;
  return { id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role as Role };
};

export const requireUser = async () => {
  const user = await getUser();
  if (!user) redirect("/entrar");
  return user;
};

export const requireProfessional = cache(async () => {
  const user = await requireUser();
  const found = await db.professional.findUnique({ where: { userId: user.id } });
  if (!found) redirect(user.role === "admin" ? "/admin" : "/");
  const expired = found.plan !== "GRATUITO" && found.planUntil && found.planUntil < new Date();
  const professional = expired ? await db.professional.update({ where: { id: found.id }, data: { plan: "GRATUITO", planUntil: null } }) : found;
  return { user, professional };
});

export const requireAdmin = async () => {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
};
