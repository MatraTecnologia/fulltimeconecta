import Link from "next/link";
import { BadgeCheck, Check, Circle, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { formatDate, leadChannelLabel, planLabel } from "@/lib/labels";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { delta, last30 } from "@/lib/server/stats";

const PainelPage = async () => {
  const { professional: pro } = await requireProfessional();
  const [stats, leads, videos, education] = await Promise.all([
    last30(pro.id),
    db.lead.findMany({ where: { professionalId: pro.id }, orderBy: { createdAt: "desc" }, take: 4 }),
    db.video.count({ where: { professionalId: pro.id } }),
    db.education.count({ where: { professionalId: pro.id } }),
  ]);
  const { current: c, previous: p } = stats;
  const checklist = [
    { label: "Foto e bio", done: Boolean(pro.avatarUrl && pro.bio.length >= 200), href: "/painel/perfil" },
    { label: "Registro verificado", done: pro.status === "VERIFICADO", href: "/painel/verificacao" },
    { label: "Condições e abordagens", done: pro.conditions.length > 0 && pro.approaches.length > 0, href: "/painel/atendimento" },
    { label: "Local de atendimento", done: Boolean(pro.city), href: "/painel/atendimento" },
    { label: "Vídeo de apresentação", done: videos > 0, href: "/painel/portfolio" },
    { label: "Formação cadastrada", done: education > 0, href: "/painel/verificacao" },
  ];
  const done = checklist.filter((c) => c.done).length;
  const pct = Math.round((done / checklist.length) * 100);

  return (
    <>
      <PanelHeader title={`Olá, ${pro.name.split(" ")[0]}`} description="Resumo do seu perfil nos últimos 30 dias" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visitas ao perfil" value={c.views.toLocaleString("pt-BR")} delta={delta(c.views, p.views)} />
        <Stat label="Cliques no WhatsApp" value={String(c.clicks)} delta={delta(c.clicks, p.clicks)} />
        <Stat label="Solicitações" value={String(c.leads)} delta={delta(c.leads, p.leads)} />
        <Stat
          label="Taxa de contato"
          value={c.views ? `${(((c.clicks + c.leads) / c.views) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "—"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PanelCard title="Contatos recentes" description="Responda em até 72 h para manter sua posição na busca">
          {!leads.length && <p className="py-3 text-sm text-muted-foreground">Nenhum contato ainda. Complete o perfil para aparecer melhor na busca.</p>}
          <ul className="divide-y">
            {leads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {l.guardian} <span className="text-sm font-normal text-muted-foreground">· {l.personAge}</span>
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{l.message}</p>
                </div>
                <span className="text-xs text-muted-foreground">{leadChannelLabel[l.channel]}</span>
                {l.status === "NOVO" && <span className="rounded-full bg-brand-coral px-2 py-0.5 text-xs font-semibold text-white">Novo</span>}
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
                  {c.done ? (
                    <span className="text-muted-foreground">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="text-primary hover:underline">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Seu plano">
            <div className="flex items-center gap-2 text-sm">
              {pro.plan === "DESTAQUE" ? <Sparkles className="size-4 text-brand-amber" /> : <BadgeCheck className="size-4 text-primary" />}
              {planLabel[pro.plan]}
              {pro.planUntil && ` até ${formatDate(pro.planUntil)}`}
            </div>
            <Link href="/painel/plano" className={buttonVariants({ variant: "outline", className: "mt-4 w-full" })}>
              {pro.plan === "GRATUITO" ? "Conhecer planos" : "Gerenciar plano"}
            </Link>
          </PanelCard>
        </div>
      </div>
    </>
  );
};

export default PainelPage;
