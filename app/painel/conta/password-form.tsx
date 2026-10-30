"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const PasswordForm = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      const { error } = await authClient.changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true });
      setMsg(error ? { ok: false, text: error.message ?? "Não foi possível alterar a senha." } : { ok: true, text: "Senha alterada. Outras sessões foram encerradas." });
      if (!error) {
        setCurrent("");
        setNext("");
      }
    });

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="current">Senha atual</Label>
          <Input id="current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pwd">Nova senha</Label>
          <Input id="pwd" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" disabled={pending || !current || next.length < 8} onClick={submit}>
          Alterar senha
        </Button>
        {msg && <span className={msg.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>{msg.text}</span>}
      </div>
    </div>
  );
};
