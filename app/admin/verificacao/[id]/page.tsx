import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ExternalLink, FileText } from "lucide-react";
import { ActionButton } from "@/components/panel/action-button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { formatDate, verificationLabel } from "@/lib/labels";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/dal";
import { startReview, toggleEducation } from "@/app/admin/actions";
import { DecisionForm } from "./decision-form";

const VerificacaoAdminPage = async ({ params }: PageProps<"/admin/verificacao/[id]">) => {
  await requireAdmin();
  const pro = await db.professional.findUnique({
    where: { id: (await params).id },
    include: { documents: { orderBy: { createdAt: "desc" } }, education: { orderBy: { year: "desc" } }, user: { select: { email: true, createdAt: true } } },
  });
  if (!pro) notFound();

  return (
    <>
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
        ← Voltar para a fila
      </Link>
      <PanelHeader
        title={pro.name}
        description={`${pro.specialty} · ${verificationLabel[pro.status]}${pro.submittedAt ? ` · enviado em ${formatDate(pro.submittedAt)}` : ""}`}
        action={
          pro.status === "ENVIADO" ? (
            <ActionButton action={startReview.bind(null, pro.id)} variant="outline">
              Assumir análise
            </ActionButton>
          ) : undefined
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard title="Dados">
          <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
            <dt className="text-muted-foreground">E-mail</dt>
            <dd>{pro.user.email}</dd>
            <dt className="text-muted-foreground">Registro</dt>
            <dd>{pro.councilName ? `${pro.councilName} ${pro.councilNumber}/${pro.councilUf}` : "Sem conselho"}</dd>
            <dt className="text-muted-foreground">Cidade</dt>
            <dd>{[pro.neighborhood, pro.city].filter(Boolean).join(", ") || "—"}</dd>
            <dt className="text-muted-foreground">Conta criada</dt>
            <dd>{formatDate(pro.user.createdAt)}</dd>
          </dl>
          <p className="mt-4 text-sm whitespace-pre-line">{pro.bio || "Sem bio."}</p>
        </PanelCard>

        <PanelCard title="Documentos" description="Abrem por link temporário de 5 minutos">
          {!pro.documents.length && <p className="text-sm text-muted-foreground">Nenhum documento.</p>}
          <ul className="divide-y">
            {pro.documents.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3">
                <FileText className="size-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.kind} · {formatDate(d.createdAt)}
                  </p>
                </div>
                <a href={`/admin/documentos/${d.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  Abrir <ExternalLink className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Formação" description="Marque como comprovada a formação com certificado conferido">
          {!pro.education.length && <p className="text-sm text-muted-foreground">Nenhuma formação cadastrada.</p>}
          <ul className="divide-y">
            {pro.education.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.institution} · {e.year}
                  </p>
                </div>
                <ActionButton action={toggleEducation.bind(null, e.id)} size="sm" variant={e.verified ? "secondary" : "outline"}>
                  {e.verified ? (
                    <>
                      <BadgeCheck /> Comprovada
                    </>
                  ) : (
                    "Comprovar"
                  )}
                </ActionButton>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Decisão">
          <DecisionForm id={pro.id} />
        </PanelCard>
      </div>
    </>
  );
};

export default VerificacaoAdminPage;
