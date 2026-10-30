"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decide } from "@/app/admin/actions";

export const DecisionForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof decide>>, data: FormData) => {
    const res = await decide(id, prev, data);
    if (res?.ok) router.push("/admin");
    return res;
  }, null);

  return (
    <form action={action} className="space-y-3">
      <Textarea name="note" rows={3} maxLength={500} placeholder="Mensagem para o profissional (obrigatória para correção ou reprovação)" />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="decision" value="approve" disabled={pending}>
          Aprovar e publicar
        </Button>
        <Button type="submit" name="decision" value="correction" variant="outline" disabled={pending}>
          Pedir correção
        </Button>
        <Button type="submit" name="decision" value="reject" variant="destructive" disabled={pending}>
          Reprovar
        </Button>
      </div>
    </form>
  );
};
