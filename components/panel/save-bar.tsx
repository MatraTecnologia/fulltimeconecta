"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SaveBar = ({ note }: { note?: string }) => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur">
      <p className="text-sm text-muted-foreground">{saved ? "Alterações salvas (simulado)." : (note ?? "Alterações não salvas.")}</p>
      <Button
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
      >
        {saved && <Check />} {saved ? "Salvo" : "Salvar alterações"}
      </Button>
    </div>
  );
};
