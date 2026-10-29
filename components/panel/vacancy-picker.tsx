"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Vacancy } from "@/lib/mock/professionals";

const options: { id: Vacancy; label: string; hint: string }[] = [
  { id: "aberta", label: "Vagas abertas", hint: "Aparece no filtro “só com vaga”" },
  { id: "espera", label: "Lista de espera", hint: "Família pode entrar na fila" },
  { id: "fechada", label: "Sem vagas", hint: "Continua listado, mas sai do filtro de vaga" },
];

export const VacancyPicker = ({ initial }: { initial: Vacancy }) => {
  const [v, setV] = useState(initial);
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={v === o.id}
          onClick={() => setV(o.id)}
          className={cn("rounded-xl border p-4 text-left transition-colors", v === o.id ? "border-primary bg-primary/10" : "hover:bg-muted")}
        >
          <p className="font-semibold">{o.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{o.hint}</p>
        </button>
      ))}
    </div>
  );
};
