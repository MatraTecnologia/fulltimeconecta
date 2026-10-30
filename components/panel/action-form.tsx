"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/action-state";

export const ActionForm = ({
  action,
  children,
  note,
}: {
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  note?: string;
}) => {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction}>
      {children}
      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur">
        <p className={state?.error ? "text-sm text-destructive" : "text-sm text-muted-foreground"} role="status">
          {state?.error ?? (state?.ok ? "Alterações salvas." : (note ?? "Revise e salve as alterações."))}
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : state?.ok && <Check />} {pending ? "Salvando" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};
