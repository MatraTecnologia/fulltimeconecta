import { requestUpload } from "@/app/painel/_actions/media";
import type { UploadKind } from "@/lib/plan-limits";

export const uploadFile = async (kind: UploadKind, file: File, onProgress?: (pct: number) => void) => {
  const res = await requestUpload(kind, file.type, file.size);
  if ("error" in res) throw new Error(res.error);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", res.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Falha no envio do arquivo.")));
    xhr.onerror = () => reject(new Error("Falha no envio. Verifique o CORS do bucket R2."));
    xhr.send(file);
  });
  return res.key;
};

export const videoDuration = (file: File) =>
  new Promise<string | null>((resolve) => {
    const el = document.createElement("video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(el.src);
      const s = Math.round(el.duration);
      resolve(Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : null);
    };
    el.onerror = () => resolve(null);
    el.src = URL.createObjectURL(file);
  });
