"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/action-state";

export const ActionButton = ({
  action,
  children,
  variant,
  size,
  label,
}: {
  action: () => Promise<ActionState>;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "icon-sm";
  label?: string;
}) => {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={variant}
        size={size}
        aria-label={label}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await action();
            setError(res?.error ?? null);
            if (!res?.error) router.refresh();
          })
        }
      >
        {pending ? <Loader2 className="animate-spin" /> : children}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
};
