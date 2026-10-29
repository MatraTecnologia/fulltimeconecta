import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { orders } from "@/lib/mock/panel";

const PlanoPage = () => (
  <>
    <PanelHeader title="Plano e pagamentos" description="Compras avulsas, sem renovação automática" />
    <div className="grid gap-6 md:grid-cols-2">
      <PanelCard>
        <div className="flex items-center gap-2 text-brand-lilac">
          <Crown className="size-5" /> <span className="font-semibold">Premium anual</span>
        </div>
        <p className="mt-2 font-heading text-2xl font-extrabold">Ativo até 02/03/2027</p>
        <p className="mt-1 text-sm text-muted-foreground">Comprar de novo soma 365 dias ao vencimento atual.</p>
        <div className="mt-4 flex gap-2">
          <Button>Estender por R$ 499</Button>
          <Button variant="outline">Mensal R$ 59,90</Button>
        </div>
      </PanelCard>
      <PanelCard className="border-brand-amber/60">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-brand-amber" /> <span className="font-semibold">Destaque</span>
        </div>
        <p className="mt-2 font-heading text-2xl font-extrabold">Ativo até 31/10/2026</p>
        <p className="mt-1 text-sm text-muted-foreground">Topo da busca para Fonoaudiólogo(a) em Londrina-PR. Vence em 2 dias.</p>
        <Button className="mt-4">Mais 7 dias por R$ 39,90</Button>
      </PanelCard>
    </div>
    <PanelCard title="Histórico de pedidos" className="mt-6">
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
              <TableCell className="font-medium">{o.id}</TableCell>
              <TableCell>{o.item}</TableCell>
              <TableCell>{new Date(o.date).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>{o.method}</TableCell>
              <TableCell className="text-right tabular-nums">{o.amount}</TableCell>
              <TableCell>{o.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-xs text-muted-foreground">Reembolso integral em até 7 dias corridos após a compra. Pagamentos processados pelo Asaas.</p>
    </PanelCard>
  </>
);

export default PlanoPage;
