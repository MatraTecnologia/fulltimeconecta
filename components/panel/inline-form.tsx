"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/action-state";

export const InlineForm = ({
  action,
  children,
  submit,
  className,
}: {
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submit: React.ReactNode;
  className?: string;
}) => {
  const [state, formAction, pending] = useActionState(action, null);
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) {
      form.current?.reset();
      router.refresh();
    }
  }, [state, router]);
  return (
    <form ref={form} action={formAction} className={className}>
      {children}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="outline" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />} {submit}
        </Button>
        {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
        {state?.ok && <p className="text-xs text-muted-foreground">Salvo.</p>}
      </div>
    </form>
  );
};
