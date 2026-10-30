"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/app/painel/_actions/account";

export const DeleteForm = () => {
  const [state, action, pending] = useActionState(deleteAccount, null);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <Input name="confirm" placeholder="Digite EXCLUIR" aria-label="Confirmação" className="max-w-44" />
      <Button type="submit" variant="destructive" disabled={pending}>
        Excluir conta
      </Button>
      {state?.error && <span className="text-xs text-destructive">{state.error}</span>}
    </form>
  );
};
