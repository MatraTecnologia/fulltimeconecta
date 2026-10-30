"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProAvatar } from "@/components/professional/pro-badges";
import { setAvatar } from "@/app/painel/_actions/media";
import { uploadFile } from "@/lib/upload-client";
import type { Professional } from "@/lib/types";

export const AvatarUploader = ({ pro }: { pro: Professional }) => {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    try {
      const key = await uploadFile("avatar", file, setProgress);
      const res = await setAvatar(key);
      if ("error" in res) throw new Error(res.error);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ProAvatar pro={pro} size="lg" />
      <div className="space-y-2">
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Button type="button" variant="outline" disabled={progress !== null} onClick={() => input.current?.click()}>
          {progress !== null ? <Loader2 className="animate-spin" /> : <Camera />} {progress !== null ? `Enviando ${progress}%` : "Trocar foto"}
        </Button>
        <p className={error ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>{error ?? "JPG, PNG ou WebP até 5 MB. Rosto visível, sem crianças identificáveis."}</p>
      </div>
    </div>
  );
};
