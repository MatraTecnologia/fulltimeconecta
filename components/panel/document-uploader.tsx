"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { addDocument } from "@/app/painel/_actions/verification";
import { uploadFile } from "@/lib/upload-client";

export const DocumentUploader = ({ disabled }: { disabled?: boolean }) => {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [kind, setKind] = useState("Conselho");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    try {
      const key = await uploadFile("document", file, setProgress);
      const res = await addDocument(key, kind, file.name);
      if (res?.error) throw new Error(res.error);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <NativeSelect value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Tipo de documento">
          <NativeSelectOption>Conselho</NativeSelectOption>
          <NativeSelectOption>Identidade</NativeSelectOption>
          <NativeSelectOption>Formação</NativeSelectOption>
        </NativeSelect>
        <Button type="button" variant="outline" disabled={disabled || progress !== null} onClick={() => input.current?.click()}>
          {progress !== null ? <Loader2 className="animate-spin" /> : <Upload />} {progress !== null ? `Enviando ${progress}%` : "Enviar documento"}
        </Button>
      </div>
      <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <p className={error ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>{error ?? "PDF, JPG ou PNG até 10 MB. Só a equipe de moderação tem acesso."}</p>
    </div>
  );
};
