import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/panel/action-button";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { formatDate, verificationLabel } from "@/lib/labels";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/dal";
import { hideReported, resolveReport } from "./actions";

export const metadata: Metadata = { title: "Moderação · Fulltime" };

const AdminPage = async () => {
  await requireAdmin();
  const [queue, reports, published] = await Promise.all([
    db.professional.findMany({
      where: { status: { in: ["ENVIADO", "EM_ANALISE", "CORRECAO"] } },
      orderBy: { submittedAt: "asc" },
      include: { _count: { select: { documents: true } } },
    }),
    db.report.findMany({ where: { status: "ABERTA" }, orderBy: { createdAt: "desc" }, include: { professional: { select: { name: true } }, review: { select: { text: true } } } }),
    db.professional.count({ where: { status: "VERIFICADO" } }),
  ]);
  const pending = queue.filter((q) => q.status !== "CORRECAO");

  return (
    <>
      <PanelHeader title="Painel de moderação" description="Verificações e denúncias pendentes" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Verificações na fila" value={String(pending.length)} />
        <Stat label="Denúncias abertas" value={String(reports.length)} />
        <Stat label="Perfis publicados" value={published.toLocaleString("pt-BR")} />
      </div>

      <PanelCard title="Fila de verificação" description="SLA de 2 dias úteis. Conferir registro na consulta pública do conselho." className="mt-6">
        {!queue.length ? (
          <p className="text-sm text-muted-foreground">Nenhum perfil aguardando análise.</p>
        ) : (
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
              {queue.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.specialty}</p>
                  </TableCell>
                  <TableCell>{v.councilName ? `${v.councilName} ${v.councilNumber}/${v.councilUf}` : "Sem conselho"}</TableCell>
                  <TableCell>{v.submittedAt ? formatDate(v.submittedAt) : "—"}</TableCell>
                  <TableCell>{v._count.documents}</TableCell>
                  <TableCell>{verificationLabel[v.status]}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/verificacao/${v.id}`} className={buttonVariants({ size: "sm" })}>
                      Analisar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PanelCard>

      <PanelCard title="Denúncias" description="3 denúncias de perfil em 30 dias ocultam o perfil preventivamente" className="mt-6">
        {!reports.length ? (
          <p className="text-sm text-muted-foreground">Nenhuma denúncia aberta.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alvo</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-80">
                    <p className="font-medium">{r.review ? `Avaliação em ${r.professional.name}` : `Perfil · ${r.professional.name}`}</p>
                    {(r.review?.text || r.details) && <p className="truncate text-xs text-muted-foreground">{r.review?.text ?? r.details}</p>}
                  </TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <ActionButton action={resolveReport.bind(null, r.id)} size="sm" variant="outline">
                        Arquivar
                      </ActionButton>
                      <ActionButton action={hideReported.bind(null, r.id)} size="sm" variant="destructive">
                        Ocultar
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PanelCard>
    </>
  );
};

export default AdminPage;
