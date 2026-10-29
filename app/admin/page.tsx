import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { PrototypeBanner } from "@/components/site/prototype-banner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModerationActions } from "./moderation-actions";
import { reports, verificationQueue } from "@/lib/mock/panel";

export const metadata: Metadata = { title: "Moderação · NeuroConecta" };

const AdminPage = () => (
  <>
    <PrototypeBanner />
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Logo href="/admin" />
        <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">Moderação</span>
      </div>
    </header>
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <PanelHeader title="Painel de moderação" description="Verificações e denúncias pendentes" />
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Verificações na fila" value={String(verificationQueue.length)} />
        <Stat label="Tempo médio de análise" value="1,4 dia" />
        <Stat label="Denúncias abertas" value={String(reports.filter((r) => r.status === "aberta").length)} />
        <Stat label="Perfis publicados" value="1.284" />
      </div>

      <PanelCard title="Fila de verificação" description="SLA de 2 dias úteis. Conferir registro na consulta pública do conselho." className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profissional</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Enviado</TableHead>
              <TableHead>Docs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verificationQueue.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.specialty}</p>
                </TableCell>
                <TableCell>{v.council}</TableCell>
                <TableCell>{new Date(v.sent).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{v.docs}</TableCell>
                <TableCell className="capitalize">{v.status}</TableCell>
                <TableCell className="text-right">
                  <ModerationActions approve="Aprovar" reject="Reprovar" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PanelCard>

      <PanelCard title="Denúncias" description="3 denúncias em 30 dias ou suspeita de registro falso ocultam o perfil preventivamente" className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alvo</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.target}</TableCell>
                <TableCell>{r.reason}</TableCell>
                <TableCell>{r.count}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="capitalize">{r.status}</TableCell>
                <TableCell className="text-right">
                  <ModerationActions approve="Arquivar" reject="Suspender" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PanelCard>
    </main>
  </>
);

export default AdminPage;
