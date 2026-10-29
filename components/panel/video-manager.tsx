"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoPlayer } from "@/components/professional/video-player";
import { youtubeId } from "@/lib/youtube";
import type { Video } from "@/lib/mock/media";

export const VideoManager = ({ initial, limit }: { initial: Video[]; limit: number }) => {
  const [videos, setVideos] = useState(initial);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const valid = youtubeId(url);

  const add = () => {
    setVideos([...videos, { title: title || "Novo vídeo", duration: "—", url }]);
    setUrl("");
    setTitle("");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <div key={`${v.title}-${i}`} className="space-y-2">
            <VideoPlayer video={v} index={i} />
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{i === 0 ? <strong>Principal · </strong> : null}{v.title}</span>
              <Button variant="ghost" size="icon-sm" aria-label="Remover vídeo" onClick={() => setVideos(videos.filter((_, j) => j !== i))}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {videos.length < limit ? (
        <div className="space-y-3 rounded-xl border border-dashed p-4">
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link do YouTube (youtube.com/watch?v=… ou youtu.be/…)" aria-label="Link do vídeo" />
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do vídeo" aria-label="Título" />
            <Button onClick={add} disabled={!valid}>
              <Plus /> Adicionar
            </Button>
          </div>
          {url && !valid && <p className="text-xs text-destructive">Link não reconhecido. Use um link do YouTube.</p>}
          {valid && (
            <div className="max-w-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Pré-visualização (clique para tocar)</p>
              <VideoPlayer video={{ title: title || "Novo vídeo", duration: "—", url }} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Limite de {limit} vídeos do seu plano atingido.</p>
      )}
    </div>
  );
};
