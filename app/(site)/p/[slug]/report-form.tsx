"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { reportProfile } from "@/app/(site)/_actions/public";

const reasons = ["Promessa de cura", "Registro falso", "Conteúdo impróprio", "Dados de terceiros", "Outro"];

export const ReportForm = ({ slug }: { slug: string }) => {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(reportProfile.bind(null, slug), null);

  if (state?.ok) return <p className="text-xs text-muted-foreground">Denúncia recebida. A moderação analisa em até 2 dias úteis.</p>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
        <Flag className="size-3.5" /> Denunciar perfil
      </button>
    );

  return (
    <form action={action} className="space-y-2 rounded-xl border p-3">
      <NativeSelect name="reason" size="sm" className="w-full" aria-label="Motivo">
        {reasons.map((r) => (
          <NativeSelectOption key={r}>{r}</NativeSelectOption>
        ))}
      </NativeSelect>
      <Textarea name="details" rows={2} maxLength={500} placeholder="Detalhes (opcional)" />
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" variant="destructive" disabled={pending}>
          Enviar denúncia
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
