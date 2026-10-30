"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { modalities } from "@/lib/catalog";
import { sendLead } from "@/app/(site)/_actions/public";

export const ContactForm = ({ name, slug }: { name: string; slug: string }) => {
  const [state, action, pending] = useActionState(sendLead.bind(null, slug), null);

  if (state?.ok)
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-heading font-bold">Solicitação enviada</p>
        <p className="text-sm text-muted-foreground">{name} recebe no painel e entra em contato pelo telefone ou e-mail informado.</p>
      </div>
    );

  return (
    <form action={action} className="space-y-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="space-y-1.5">
        <Label htmlFor="guardian">Seu nome</Label>
        <Input id="guardian" name="guardian" required minLength={3} placeholder="Nome do responsável" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">WhatsApp ou e-mail</Label>
        <Input id="phone" name="contact" required minLength={8} placeholder="(43) 99999-0000" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="age">Idade de quem será atendido</Label>
          <Input id="age" name="personAge" required placeholder="Ex.: 4 anos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mod">Modalidade</Label>
          <NativeSelect id="mod" name="modality" className="w-full">
            {modalities.map((m) => (
              <NativeSelectOption key={m}>{m}</NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="msg">Mensagem</Label>
        <Textarea id="msg" name="message" maxLength={500} placeholder="Conte brevemente o que procura. Não inclua laudos ou dados clínicos." />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enviando…" : "Enviar"}
      </Button>
    </form>
  );
};
