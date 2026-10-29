import Link from "next/link";
import { BadgeCheck, Check, Circle, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { leads, weeklyStats } from "@/lib/mock/panel";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const checklist = [
  { label: "Foto e bio", done: true },
  { label: "Registro verificado", done: true },
  { label: "Condições e abordagens", done: true },
  { label: "Local de atendimento", done: true },
  { label: "Vídeo de apresentação", done: false, href: "/painel/portfolio" },
  { label: "Certificado da especialização em Linguagem", done: false, href: "/painel/verificacao" },
];

const PainelPage = () => {
  const last4 = weeklyStats.slice(-4);
  const sum = (k: "views" | "clicks" | "leads") => last4.reduce((a, w) => a + w[k], 0);
  const done = checklist.filter((c) => c.done).length;
  const pct = Math.round((done / checklist.length) * 100);

  return (
    <>
      <PanelHeader title={`Olá, ${pro.name.split(" ")[0]}`} description="Resumo do seu perfil nos últimos 30 dias" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visitas ao perfil" value={sum("views").toLocaleString("pt-BR")} delta="+38% vs. mês anterior" />
        <Stat label="Cliques no WhatsApp" value={String(sum("clicks"))} delta="+42%" />
        <Stat label="Solicitações" value={String(sum("leads"))} delta="+51%" />
        <Stat label="Taxa de contato" value={`${((sum("clicks") / sum("views")) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PanelCard title="Contatos recentes" description="Responda em até 72 h para manter sua posição na busca">
          <ul className="divide-y">
            {leads.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {l.guardian} <span className="text-sm font-normal text-muted-foreground">· {l.personAge}</span>
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{l.message}</p>
                </div>
                <span className="text-xs text-muted-foreground">{l.channel}</span>
                {l.status === "novo" && <span className="rounded-full bg-brand-coral px-2 py-0.5 text-xs font-semibold text-white">Novo</span>}
              </li>
            ))}
          </ul>
          <Link href="/painel/leads" className={buttonVariants({ variant: "link", className: "mt-2 px-0" })}>
            Ver todos os contatos
          </Link>
        </PanelCard>

        <div className="space-y-6">
          <PanelCard title="Completude do perfil">
            <Progress value={pct} />
            <p className="mt-2 text-sm text-muted-foreground">{pct}% completo · perfis completos aparecem antes na busca</p>
            <ul className="mt-4 space-y-2 text-sm">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.done ? <Check className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground" />}
                  {c.href ? (
                    <Link href={c.href} className="text-primary hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Seu plano">
            <div className="flex items-center gap-2 text-sm">
              <BadgeCheck className="size-4 text-primary" /> Premium anual até 02/03/2027
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Sparkles className="size-4 text-brand-amber" /> Destaque ativo até 31/10/2026
            </div>
            <Link href="/painel/plano" className={buttonVariants({ variant: "outline", className: "mt-4 w-full" })}>
              Renovar Destaque
            </Link>
          </PanelCard>
        </div>
      </div>
    </>
  );
};

export default PainelPage;
