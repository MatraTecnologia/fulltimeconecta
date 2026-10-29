"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeId } from "@/lib/youtube";
import type { Video } from "@/lib/mock/media";

const tints = ["from-brand-teal/80 to-brand-sky/70", "from-brand-coral/80 to-brand-amber/70", "from-brand-lilac/80 to-brand-sky/70", "from-brand-sage/80 to-brand-teal/70"];

export const VideoPlayer = ({ video, index = 0, large }: { video: Video; index?: number; large?: boolean }) => {
  const [playing, setPlaying] = useState(false);
  const id = video.url ? youtubeId(video.url) : null;

  if (playing && id)
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn("group relative block aspect-video w-full overflow-hidden rounded-2xl bg-linear-to-br text-left text-white", tints[index % tints.length])}
      aria-label={`Assistir: ${video.title}`}
    >
      {id && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 size-full object-cover" />}
      <span className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
      <span
        className={cn(
          "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform group-hover:scale-110",
          large ? "size-16" : "size-11",
        )}
      >
        <Play className={cn("fill-current", large ? "size-7" : "size-5")} />
      </span>
      <span className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-2">
        <span className={cn("font-heading font-bold drop-shadow", large ? "text-lg" : "text-sm")}>{video.title}</span>
        <span className="rounded bg-black/60 px-1.5 py-0.5 text-xs tabular-nums">{video.duration}</span>
      </span>
      {playing && !id && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center text-sm">
          Vídeo de demonstração. Com um link real do YouTube, o vídeo toca aqui.
        </span>
      )}
    </button>
  );
};
