"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpFamily } from "@/app/(site)/_actions/auth";

export const FamilyForm = ({ next }: { next?: string }) => {
  const [state, action, pending] = useActionState(signUpFamily, null);
  const [accepted, setAccepted] = useState(false);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-1.5">
        <Label htmlFor="name">Seu nome</Label>
        <Input id="name" name="name" autoComplete="name" required minLength={3} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pwd">Senha (mínimo 8 caracteres)</Label>
        <Input id="pwd" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <Checkbox checked={accepted} onCheckedChange={setAccepted} className="mt-0.5" />
        {accepted && <input type="hidden" name="terms" value="on" />}
        <span>Tenho 18 anos ou mais e aceito os Termos de Uso e a Política de Privacidade.</span>
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={!accepted || pending}>
        {pending ? "Criando conta…" : "Criar conta"}
      </Button>
    </form>
  );
};
