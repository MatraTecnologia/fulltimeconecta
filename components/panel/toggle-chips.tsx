"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ToggleChips = ({ options, initial }: { options: readonly string[]; initial: string[] }) => {
  const [sel, setSel] = useState(initial);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = sel.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => setSel(on ? sel.filter((x) => x !== o) : [...sel, o])}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors",
              on ? "border-primary bg-primary/10 font-medium text-primary" : "hover:bg-muted",
            )}
          >
            {on && <Check className="size-3.5" />} {o}
          </button>
        );
      })}
    </div>
  );
};
