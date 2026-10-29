"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { leads as initial, type LeadStatus } from "@/lib/mock/panel";

const statuses: LeadStatus[] = ["novo", "respondido", "convertido", "descartado"];
const tone: Record<LeadStatus, string> = {
  novo: "bg-brand-coral/15 text-brand-coral",
  respondido: "bg-brand-sky/15 text-brand-sky",
  convertido: "bg-brand-sage/20 text-[oklch(0.45_0.09_154)]",
  descartado: "bg-muted text-muted-foreground",
};

export const LeadsTable = () => {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<LeadStatus | "todos">("todos");
  const shown = rows.filter((r) => filter === "todos" || r.status === filter);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["todos", ...statuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn("rounded-full border px-3 py-1 text-sm capitalize", filter === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            {s} {s !== "todos" && `(${rows.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((l) => (
          <div key={l.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 md:flex-row md:items-center">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{l.guardian}</p>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", tone[l.status])}>{l.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {l.channel} · {new Date(l.date).toLocaleDateString("pt-BR")} · {l.personAge}
                {l.condition && ` · ${l.condition}`} · {l.modality}
              </p>
              <p className="text-sm">{l.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <NativeSelect
                size="sm"
                value={l.status}
                aria-label="Status do contato"
                onChange={(e) => setRows(rows.map((r) => (r.id === l.id ? { ...r, status: e.target.value as LeadStatus } : r)))}
              >
                {statuses.map((s) => (
                  <NativeSelectOption key={s} value={s}>
                    {s}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm" })}>
                <MessageCircle /> Responder
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
