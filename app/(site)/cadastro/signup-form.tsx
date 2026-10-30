"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { specialties } from "@/lib/catalog";
import { signUpProfessional } from "@/app/(site)/_actions/auth";

const councils = ["CRP", "CRFa", "CREFITO", "CRM", "CRN", "ABPp", "Sem conselho (certificado)"];
const ufs = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export const SignupForm = () => {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [state, action, pending] = useActionState(signUpProfessional, null);
  const steps = useRef<(HTMLDivElement | null)[]>([]);

  const next = () => {
    const fields = steps.current[step]?.querySelectorAll<HTMLInputElement>("input, select") ?? [];
    if ([...fields].every((f) => f.reportValidity())) setStep(step + 1);
  };

  return (
    <form action={action} className="space-y-4">
      <ol className="mb-2 flex gap-2">
        {["Conta", "Profissão", "Termos"].map((s, i) => (
          <li key={s} className="flex-1">
            <div className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
            <p className={cn("mt-1 text-xs", i === step ? "font-semibold" : "text-muted-foreground")}>{s}</p>
          </li>
        ))}
      </ol>

      <div ref={(el) => void (steps.current[0] = el)} hidden={step !== 0} className="space-y-4">
          <Field id="name" label="Nome completo">
            <Input id="name" name="name" autoComplete="name" required minLength={3} />
          </Field>
          <Field id="email" label="E-mail">
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field id="email2" label="Confirme seu e-mail">
            <Input id="email2" name="email2" type="email" required />
          </Field>
          <Field id="pwd" label="Senha (mínimo 8 caracteres)">
            <Input id="pwd" name="password" type="password" autoComplete="new-password" minLength={8} required />
          </Field>
      </div>

      <div ref={(el) => void (steps.current[1] = el)} hidden={step !== 1} className="space-y-4">
          <Field id="spec" label="Especialidade principal">
            <NativeSelect id="spec" name="specialty" className="w-full">
              {specialties.map((s) => (
                <NativeSelectOption key={s}>{s}</NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <div className="grid grid-cols-[1fr_1fr_80px] gap-2">
            <Field id="council" label="Conselho">
              <NativeSelect id="council" name="council" className="w-full">
                {councils.map((c) => (
                  <NativeSelectOption key={c}>{c}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field id="num" label="Número">
              <Input id="num" name="councilNumber" placeholder="08/12345" />
            </Field>
            <Field id="uf" label="UF">
              <NativeSelect id="uf" name="councilUf" defaultValue="PR" className="w-full">
                {ufs.map((u) => (
                  <NativeSelectOption key={u}>{u}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            Conferimos o registro na consulta pública do conselho. Seu perfil só aparece na busca depois da aprovação.
          </p>
      </div>

      {step === 2 && (
        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={accepted} onCheckedChange={setAccepted} className="mt-0.5" />
          {accepted && <input type="hidden" name="terms" value="on" />}
          <span>
            Tenho 18 anos ou mais e aceito os <a className="text-primary underline">Termos de Uso</a>, a{" "}
            <a className="text-primary underline">Política de Privacidade</a> e a <a className="text-primary underline">Política de Cookies</a>.
          </span>
        </label>
      )}

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" size="lg" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" size="lg" className="flex-1" onClick={next}>
            Continuar
          </Button>
        ) : (
          <Button type="submit" size="lg" className="flex-1" disabled={!accepted || pending}>
            {pending ? "Criando conta…" : "Criar conta gratuita"}
          </Button>
        )}
      </div>
    </form>
  );
};
