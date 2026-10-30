"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { setLeadStatus } from "@/app/painel/_actions/leads";
import { leadChannelLabel, leadStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

type LeadStatus = keyof typeof leadStatusLabel;
type Lead = {
  id: string;
  guardian: string;
  contact: string;
  channel: keyof typeof leadChannelLabel;
  personAge: string;
  condition: string | null;
  modality: string | null;
  message: string;
  date: string;
  status: LeadStatus;
};

const statuses = Object.keys(leadStatusLabel) as LeadStatus[];
const tone: Record<LeadStatus, string> = {
  NOVO: "bg-brand-coral/15 text-brand-coral",
  RESPONDIDO: "bg-brand-sky/15 text-brand-sky",
  CONVERTIDO: "bg-brand-sage/20 text-[oklch(0.45_0.09_154)]",
  DESCARTADO: "bg-muted text-muted-foreground",
};

const replyHref = (contact: string) => {
  if (contact.includes("@")) return `mailto:${contact}`;
  const digits = contact.replace(/\D/g, "");
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`;
};

export const LeadsTable = ({ leads }: { leads: Lead[] }) => {
  const [rows, setOptimistic] = useOptimistic(leads, (state, { id, status }: { id: string; status: LeadStatus }) =>
    state.map((r) => (r.id === id ? { ...r, status } : r)),
  );
  const [, start] = useTransition();
  const [filter, setFilter] = useState<LeadStatus | "TODOS">("TODOS");
  const shown = rows.filter((r) => filter === "TODOS" || r.status === filter);

  if (!leads.length) return <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">Nenhuma solicitação recebida ainda.</p>;

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["TODOS", ...statuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn("rounded-full border px-3 py-1 text-sm", filter === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            {s === "TODOS" ? "Todos" : leadStatusLabel[s]} {s !== "TODOS" && `(${rows.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((l) => (
          <div key={l.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 md:flex-row md:items-center">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{l.guardian}</p>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", tone[l.status])}>{leadStatusLabel[l.status]}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {[leadChannelLabel[l.channel], new Date(l.date).toLocaleDateString("pt-BR"), l.personAge, l.condition, l.modality, l.contact].filter(Boolean).join(" · ")}
              </p>
              <p className="text-sm">{l.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <NativeSelect
                size="sm"
                value={l.status}
                aria-label="Status do contato"
                onChange={(e) => {
                  const status = e.target.value as LeadStatus;
                  start(async () => {
                    setOptimistic({ id: l.id, status });
                    await setLeadStatus(l.id, status);
                  });
                }}
              >
                {statuses.map((s) => (
                  <NativeSelectOption key={s} value={s}>
                    {leadStatusLabel[s]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {l.contact && (
                <a href={replyHref(l.contact)} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm" })}>
                  {l.contact.includes("@") ? <Mail /> : <MessageCircle />} Responder
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
