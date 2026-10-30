"use server";

import { randomUUID } from "node:crypto";
import { planLimits, uploadRules, type UploadKind } from "@/lib/plan-limits";
import { youtubeId } from "@/lib/youtube";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { presignPut, publicUrl, removeObject } from "@/lib/server/r2";
import { refreshProfessional } from "@/lib/server/revalidate";

const ext: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

const prefix = (proId: string, kind: UploadKind) => `profiles/${proId}/${kind}/`;
const owns = (proId: string, kind: UploadKind, key: string) => key.startsWith(prefix(proId, kind)) && !key.includes("..");

export const requestUpload = async (kind: UploadKind, contentType: string, size: number) => {
  const { professional: pro } = await requireProfessional();
  const rule = uploadRules[kind];
  if (!rule) return { error: "Tipo de envio inválido." };
  if (!(rule.types as readonly string[]).includes(contentType)) return { error: "Formato de arquivo não aceito." };
  if (size <= 0 || size > rule.maxMb * 1024 * 1024) return { error: `O arquivo deve ter até ${rule.maxMb} MB.` };

  const limits = planLimits[pro.plan];
  if (kind === "photo" && (await db.photo.count({ where: { professionalId: pro.id } })) >= limits.photos)
    return { error: limits.photos ? `Limite de ${limits.photos} fotos do seu plano.` : "A galeria de fotos faz parte do plano Premium." };
  if (kind === "video" && (await db.video.count({ where: { professionalId: pro.id } })) >= limits.videos)
    return { error: limits.videos ? `Limite de ${limits.videos} vídeos do seu plano.` : "Vídeos fazem parte do plano Premium." };

  const key = `${prefix(pro.id, kind)}${randomUUID()}.${ext[contentType]}`;
  return { key, uploadUrl: await presignPut(key, contentType, size, rule.private) };
};

export const setAvatar = async (key: string) => {
  const { professional: pro } = await requireProfessional();
  if (!owns(pro.id, "avatar", key)) return { error: "Arquivo inválido." };
  await db.professional.update({ where: { id: pro.id }, data: { avatarUrl: publicUrl(key) } });
  if (pro.avatarUrl) await removeObject(pro.avatarUrl.slice(pro.avatarUrl.indexOf("profiles/")));
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const addPhoto = async (key: string, caption: string) => {
  const { professional: pro } = await requireProfessional();
  if (!owns(pro.id, "photo", key)) return { error: "Arquivo inválido." };
  const count = await db.photo.count({ where: { professionalId: pro.id } });
  if (count >= planLimits[pro.plan].photos) return { error: "Limite de fotos do seu plano." };
  await db.photo.create({ data: { professionalId: pro.id, key, url: publicUrl(key), caption: caption.slice(0, 80), position: count } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const removePhoto = async (id: string) => {
  const { professional: pro } = await requireProfessional();
  const photo = await db.photo.findFirst({ where: { id, professionalId: pro.id } });
  if (!photo) return { error: "Foto não encontrada." };
  await db.photo.delete({ where: { id } });
  await removeObject(photo.key);
  refreshProfessional(pro.slug);
  return { ok: true };
};

const canAddVideo = async (proId: string, plan: keyof typeof planLimits) => (await db.video.count({ where: { professionalId: proId } })) < planLimits[plan].videos;

export const addYoutubeVideo = async (url: string, title: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const id = youtubeId(url);
  if (!id) return { error: "Link do YouTube não reconhecido." };
  if (!(await canAddVideo(pro.id, pro.plan))) return { error: "Limite de vídeos do seu plano." };
  const position = await db.video.count({ where: { professionalId: pro.id } });
  await db.video.create({ data: { professionalId: pro.id, kind: "YOUTUBE", url: `https://www.youtube.com/watch?v=${id}`, title: title.slice(0, 80) || "Vídeo", position } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const addUploadedVideo = async (key: string, title: string, duration: string | null): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (!owns(pro.id, "video", key)) return { error: "Arquivo inválido." };
  if (!(await canAddVideo(pro.id, pro.plan))) return { error: "Limite de vídeos do seu plano." };
  const position = await db.video.count({ where: { professionalId: pro.id } });
  await db.video.create({ data: { professionalId: pro.id, kind: "UPLOAD", key, url: publicUrl(key), title: title.slice(0, 80) || "Vídeo", duration, position } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const removeVideo = async (id: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  const video = await db.video.findFirst({ where: { id, professionalId: pro.id } });
  if (!video) return { error: "Vídeo não encontrado." };
  await db.video.delete({ where: { id } });
  if (video.key) await removeObject(video.key);
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const addPortfolioItem = async (type: string, title: string, detail: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  if (!["Curso", "Artigo", "Evento", "Publicação"].includes(type) || title.trim().length < 3) return { error: "Preencha tipo e título." };
  await db.portfolioItem.create({ data: { professionalId: pro.id, type, title: title.trim().slice(0, 120), detail: detail.trim().slice(0, 160) } });
  refreshProfessional(pro.slug);
  return { ok: true };
};

export const removePortfolioItem = async (id: string): Promise<ActionState> => {
  const { professional: pro } = await requireProfessional();
  await db.portfolioItem.deleteMany({ where: { id, professionalId: pro.id } });
  refreshProfessional(pro.slug);
  return { ok: true };
};
