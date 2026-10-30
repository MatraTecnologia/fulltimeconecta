"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoPlayer } from "@/components/professional/video-player";
import { addUploadedVideo, addYoutubeVideo, removeVideo } from "@/app/painel/_actions/media";
import { uploadFile, videoDuration } from "@/lib/upload-client";
import { youtubeId } from "@/lib/youtube";
import type { Video } from "@/lib/types";

export const VideoManager = ({ videos, limit }: { videos: Video[]; limit: number }) => {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const valid = youtubeId(url);

  const done = (res: { error?: string }) => {
    if (res.error) return setError(res.error);
    setError(null);
    setUrl("");
    setTitle("");
    router.refresh();
  };

  const onFile = async (file: File) => {
    setError(null);
    try {
      const duration = await videoDuration(file);
      const key = await uploadFile("video", file, setProgress);
      done((await addUploadedVideo(key, title || file.name.replace(/\.[^.]+$/, ""), duration)) ?? {});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  if (!limit) return <p className="text-sm text-muted-foreground">Vídeos fazem parte do plano Premium.</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <div key={v.id} className="space-y-2">
            <VideoPlayer video={v} index={i} />
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">
                {i === 0 ? <strong>Principal · </strong> : null}
                {v.title}
              </span>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Remover vídeo" disabled={pending} onClick={() => start(async () => done((await removeVideo(v.id!)) ?? {}))}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {videos.length < limit ? (
        <div className="space-y-3 rounded-xl border border-dashed p-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do vídeo" aria-label="Título" maxLength={80} />
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link do YouTube (youtube.com/watch?v=… ou youtu.be/…)" aria-label="Link do vídeo" />
            <Button type="button" disabled={!valid || pending} onClick={() => start(async () => done((await addYoutubeVideo(url, title)) ?? {}))}>
              <Plus /> Adicionar link
            </Button>
            <Button type="button" variant="outline" disabled={progress !== null} onClick={() => input.current?.click()}>
              {progress !== null ? <Loader2 className="animate-spin" /> : <Upload />} {progress !== null ? `Enviando ${progress}%` : "Enviar arquivo"}
            </Button>
          </div>
          <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <p className="text-xs text-muted-foreground">Arquivo MP4, WebM ou MOV até 200 MB.</p>
          {url && !valid && <p className="text-xs text-destructive">Link não reconhecido. Use um link do YouTube.</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {valid && (
            <div className="max-w-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Pré-visualização (clique para tocar)</p>
              <VideoPlayer video={{ kind: "youtube", title: title || "Novo vídeo", duration: null, url }} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Limite de {limit} vídeos do seu plano atingido.</p>
      )}
    </div>
  );
};
