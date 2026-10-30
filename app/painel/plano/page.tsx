import { Crown, Sparkles } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/panel/action-button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { buyPlan } from "@/app/painel/_actions/plan";
import { formatDate, planLabel } from "@/lib/labels";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";

const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PlanoPage = async () => {
  const { professional: pro } = await requireProfessional();
  const orders = await db.order.findMany({ where: { professionalId: pro.id }, orderBy: { createdAt: "desc" } });
  const until = pro.planUntil ? `Ativo até ${formatDate(pro.planUntil)}` : "Sem vencimento";

  return (
    <>
      <PanelHeader title="Plano e pagamentos" description="Compras avulsas, sem renovação automática. Comprar de novo soma os dias ao vencimento atual." />
      <p className="mb-6 rounded-xl border border-brand-amber/50 bg-brand-amber/10 p-3 text-sm">
        Pagamento simulado: a integração com o gateway ainda não foi feita, então a compra ativa o plano na hora sem cobrança.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <PanelCard>
          <div className="flex items-center gap-2 text-brand-lilac">
            <Crown className="size-5" /> <span className="font-semibold">Plano atual: {planLabel[pro.plan]}</span>
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold">{until}</p>
          <p className="mt-1 text-sm text-muted-foreground">Premium libera galeria, vídeos, condições ilimitadas e prioridade na busca.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton action={buyPlan.bind(null, "premium-anual")}>Premium anual R$ 499</ActionButton>
            <ActionButton action={buyPlan.bind(null, "premium-mensal")} variant="outline">
              Mensal R$ 59,90
            </ActionButton>
          </div>
        </PanelCard>
        <PanelCard className="border-brand-amber/60">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-brand-amber" /> <span className="font-semibold">Destaque</span>
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold">{pro.plan === "DESTAQUE" ? until : "Inativo"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Topo da busca para {pro.specialty}
            {pro.city && ` em ${pro.city}`}. Inclui os recursos do Premium.
          </p>
          <div className="mt-4">
            <ActionButton action={buyPlan.bind(null, "destaque")}>Mais 7 dias por R$ 39,90</ActionButton>
          </div>
        </PanelCard>
      </div>
      <PanelCard title="Histórico de pedidos" className="mt-6">
        {!orders.length ? (
          <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{o.item}</TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell>{o.method}</TableCell>
                  <TableCell className="text-right tabular-nums">{brl(o.amount)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="mt-4 text-xs text-muted-foreground">Reembolso integral em até 7 dias corridos após a compra.</p>
      </PanelCard>
    </>
  );
};

export default PlanoPage;
