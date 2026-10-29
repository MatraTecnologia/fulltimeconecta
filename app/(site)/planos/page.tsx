import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { plans } from "@/lib/mock/catalog";

export const metadata: Metadata = { title: "Planos · NeuroConecta" };

const faq = [
  ["Tem renovação automática?", "Não. Cada compra vale pelo período escolhido. Avisamos 7 dias e 1 dia antes de vencer."],
  ["Como pago?", "Pix, boleto ou cartão. O plano anual pode ser parcelado em até 12x."],
  ["Posso pedir reembolso?", "Sim, integral em até 7 dias corridos após a compra, como prevê o Código de Defesa do Consumidor."],
  ["O que acontece quando o plano vence?", "Seu perfil volta ao Gratuito. O conteúdo extra fica oculto, não é apagado."],
];

const PlanosPage = () => (
  <div className="mx-auto max-w-6xl px-4 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold">Planos para profissionais</h1>
      <p className="mt-3 text-lg text-muted-foreground">Comece grátis. Pague só quando quiser aparecer mais.</p>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.id}
          className={cn("flex flex-col rounded-3xl border bg-card p-7", p.highlight && "border-primary ring-2 ring-primary/30")}
        >
          {p.highlight && <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Mais escolhido</span>}
          <h2 className="text-2xl font-extrabold">{p.name}</h2>
          <p className="mt-3">
            <span className="font-heading text-4xl font-extrabold">{p.price}</span>
            <span className="text-muted-foreground"> / {p.period}</span>
          </p>
          {"altPrice" in p && <p className="mt-1 text-sm font-medium text-primary">{p.altPrice}</p>}
          <ul className="mt-6 flex-1 space-y-2.5">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/cadastro" className={buttonVariants({ variant: p.highlight ? "default" : "outline", size: "lg", className: "mt-8" })}>
            {p.id === "gratuito" ? "Criar perfil grátis" : `Quero o ${p.name}`}
          </Link>
        </div>
      ))}
    </div>
    <div className="mx-auto mt-16 max-w-3xl">
      <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
      <dl className="mt-4 divide-y rounded-2xl border bg-card">
        {faq.map(([q, a]) => (
          <div key={q} className="p-5">
            <dt className="font-semibold">{q}</dt>
            <dd className="mt-1 text-muted-foreground">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
);

export default PlanosPage;
