"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPhoto, removePhoto } from "@/app/painel/_actions/media";
import { uploadFile } from "@/lib/upload-client";
import type { Photo } from "@/lib/types";

export const PhotoManager = ({ photos, limit }: { photos: Photo[]; limit: number }) => {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removing, startRemove] = useTransition();

  const onFile = async (file: File) => {
    setError(null);
    try {
      const key = await uploadFile("photo", file, setProgress);
      const res = await addPhoto(key, caption);
      if ("error" in res) throw new Error(res.error);
      setCaption("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  if (!limit) return <p className="text-sm text-muted-foreground">A galeria de fotos faz parte do plano Premium.</p>;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((p) => (
          <figure key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image src={p.url} alt={p.caption} fill sizes="(min-width: 640px) 200px, 50vw" className="object-cover" />
            {p.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-xs text-white">{p.caption}</figcaption>}
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute top-2 right-2"
              aria-label="Remover foto"
              disabled={removing}
              onClick={() => startRemove(async () => (await removePhoto(p.id), router.refresh()))}
            >
              <Trash2 />
            </Button>
          </figure>
        ))}
        {photos.length < limit && (
          <button
            type="button"
            disabled={progress !== null}
            onClick={() => input.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:bg-muted"
          >
            {progress !== null ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            {progress !== null ? `${progress}%` : "Adicionar"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {photos.length < limit && (
        <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Legenda da próxima foto (opcional)" className="max-w-sm" maxLength={80} />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
