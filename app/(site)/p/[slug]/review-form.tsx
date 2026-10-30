"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/app/(site)/_actions/public";

const criteria = [
  ["acolhimento", "Acolhimento"],
  ["comunicacao", "Comunicação com a família"],
  ["pontualidade", "Pontualidade"],
] as const;

export const ReviewForm = ({ slug }: { slug: string }) => {
  const [state, action, pending] = useActionState(submitReview.bind(null, slug), null);
  if (state?.ok) return <p className="text-sm text-muted-foreground">Obrigado! Sua avaliação foi publicada.</p>;
  return (
    <form action={action} className="space-y-3 rounded-xl border p-4">
      <p className="font-semibold">Avaliar este profissional</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {criteria.map(([name, label]) => (
          <label key={name} className="space-y-1 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <NativeSelect name={name} defaultValue="5" size="sm" className="w-full">
              {[5, 4, 3, 2, 1].map((n) => (
                <NativeSelectOption key={n} value={n}>
                  {"★".repeat(n)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        ))}
      </div>
      <Textarea name="text" rows={3} minLength={20} maxLength={1000} required placeholder="Conte como foi a experiência da sua família. Não inclua dados clínicos." />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        Publicar avaliação
      </Button>
    </form>
  );
};
