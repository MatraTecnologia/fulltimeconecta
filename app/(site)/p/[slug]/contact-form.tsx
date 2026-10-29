"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { modalities } from "@/lib/mock/catalog";

export const ContactForm = ({ name }: { name: string }) => {
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-heading font-bold">Solicitação enviada</p>
        <p className="text-sm text-muted-foreground">{name} recebe por e-mail e costuma responder em poucas horas.</p>
      </div>
    );

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="guardian">Seu nome</Label>
        <Input id="guardian" required placeholder="Nome do responsável" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefone / WhatsApp</Label>
        <Input id="phone" required type="tel" placeholder="(43) 99999-0000" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="age">Idade de quem será atendido</Label>
          <Input id="age" required placeholder="Ex.: 4 anos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mod">Modalidade</Label>
          <NativeSelect id="mod" className="w-full">
            {modalities.map((m) => (
              <NativeSelectOption key={m}>{m}</NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="msg">Mensagem</Label>
        <Textarea id="msg" maxLength={500} placeholder="Conte brevemente o que procura. Não inclua laudos ou dados clínicos." />
      </div>
      <Button type="submit" className="w-full">
        Enviar
      </Button>
    </form>
  );
};
