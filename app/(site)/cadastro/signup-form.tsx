"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { specialties } from "@/lib/mock/catalog";

const councils = ["CRP", "CRFa", "CREFITO", "CRM", "CRN", "ABPp", "Sem conselho (certificado)"];
const ufs = ["PR", "SP", "SC", "RS", "MG", "RJ"];

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export const SignupForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
    else router.push("/painel/verificacao");
  };

  return (
    <form onSubmit={next} className="space-y-4">
      <ol className="mb-2 flex gap-2">
        {["Conta", "Profissão", "Termos"].map((s, i) => (
          <li key={s} className="flex-1">
            <div className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
            <p className={cn("mt-1 text-xs", i === step ? "font-semibold" : "text-muted-foreground")}>{s}</p>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <>
          <Field id="name" label="Nome completo">
            <Input id="name" required />
          </Field>
          <Field id="email" label="E-mail">
            <Input id="email" type="email" required />
          </Field>
          <Field id="email2" label="Confirme seu e-mail">
            <Input id="email2" type="email" required />
          </Field>
          <Field id="pwd" label="Senha (mínimo 8 caracteres)">
            <Input id="pwd" type="password" minLength={8} required />
          </Field>
        </>
      )}

      {step === 1 && (
        <>
          <Field id="spec" label="Especialidade principal">
            <NativeSelect id="spec" className="w-full">
              {specialties.map((s) => (
                <NativeSelectOption key={s}>{s}</NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <div className="grid grid-cols-[1fr_1fr_80px] gap-2">
            <Field id="council" label="Conselho">
              <NativeSelect id="council" className="w-full">
                {councils.map((c) => (
                  <NativeSelectOption key={c}>{c}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field id="num" label="Número">
              <Input id="num" placeholder="08/12345" />
            </Field>
            <Field id="uf" label="UF">
              <NativeSelect id="uf" className="w-full">
                {ufs.map((u) => (
                  <NativeSelectOption key={u}>{u}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            Conferimos o registro na consulta pública do conselho. Seu perfil só aparece na busca depois da aprovação.
          </p>
        </>
      )}

      {step === 2 && (
        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={accepted} onCheckedChange={setAccepted} className="mt-0.5" />
          <span>
            Tenho 18 anos ou mais e aceito os <a className="text-primary underline">Termos de Uso</a>, a{" "}
            <a className="text-primary underline">Política de Privacidade</a> e a <a className="text-primary underline">Política de Cookies</a>.
          </span>
        </label>
      )}

      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" size="lg" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1" disabled={step === 2 && !accepted}>
          {step < 2 ? "Continuar" : "Criar conta gratuita"}
        </Button>
      </div>
    </form>
  );
};
