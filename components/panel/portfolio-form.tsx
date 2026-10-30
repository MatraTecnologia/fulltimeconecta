"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { addPortfolioItem } from "@/app/painel/_actions/media";

export const PortfolioForm = () => {
  const router = useRouter();
  const [type, setType] = useState("Curso");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      const res = await addPortfolioItem(type, title, detail);
      setError(res?.error ?? null);
      if (res?.error) return;
      setTitle("");
      setDetail("");
      router.refresh();
    });

  return (
    <div className="mt-3 space-y-2">
      <div className="grid gap-2 md:grid-cols-[140px_1fr_1fr_auto]">
        <NativeSelect value={type} onChange={(e) => setType(e.target.value)} aria-label="Tipo" className="w-full">
          {["Curso", "Artigo", "Evento", "Publicação"].map((t) => (
            <NativeSelectOption key={t}>{t}</NativeSelectOption>
          ))}
        </NativeSelect>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" aria-label="Título" maxLength={120} />
        <Input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Detalhe (ex.: Revista CEFAC · 2021)" aria-label="Detalhe" maxLength={160} />
        <Button type="button" variant="outline" disabled={pending || title.trim().length < 3} onClick={submit}>
          <Plus /> Adicionar
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
