import { BadgeCheck, Clock, FileText, Send, Trash2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionButton } from "@/components/panel/action-button";
import { DocumentUploader } from "@/components/panel/document-uploader";
import { InlineForm } from "@/components/panel/inline-form";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { addEducation, removeDocument, removeEducation, saveCouncil, submitForReview } from "@/app/painel/_actions/verification";
import { formatDate, verificationLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";

const steps = ["ENVIADO", "EM_ANALISE", "VERIFICADO"] as const;

const VerificacaoPage = async () => {
  const { professional: pro } = await requireProfessional();
  const [docs, education] = await Promise.all([
    db.document.findMany({ where: { professionalId: pro.id }, orderBy: { createdAt: "desc" } }),
    db.education.findMany({ where: { professionalId: pro.id }, orderBy: { year: "desc" } }),
  ]);
  const locked = pro.status === "ENVIADO" || pro.status === "EM_ANALISE";
  const canSubmit = ["RASCUNHO", "CORRECAO", "REJEITADO"].includes(pro.status);
  const reached = steps.indexOf(pro.status as (typeof steps)[number]);

  return (
    <>
      <PanelHeader title="Verificação" description="Só perfis verificados aparecem na busca" />
      <div className="space-y-6">
        <PanelCard>
          <div className="flex items-center gap-3">
            {pro.status === "VERIFICADO" ? (
              <BadgeCheck className="size-10 text-primary" />
            ) : pro.status === "CORRECAO" || pro.status === "REJEITADO" ? (
              <TriangleAlert className="size-10 text-destructive" />
            ) : (
              <Clock className="size-10 text-brand-amber" />
            )}
            <div>
              <p className="font-heading text-xl font-bold">{verificationLabel[pro.status]}</p>
              <p className="text-sm text-muted-foreground">
                {pro.statusNote ??
                  (pro.status === "RASCUNHO"
                    ? "Envie seus documentos e solicite a análise. Prazo: até 2 dias úteis."
                    : pro.submittedAt && `Enviado em ${formatDate(pro.submittedAt)}`)}
              </p>
            </div>
          </div>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="space-y-1">
                <div className={cn("h-1.5 rounded-full", i <= reached ? "bg-primary" : "bg-muted")} />
                <p className="text-sm font-semibold">{verificationLabel[s]}</p>
              </li>
            ))}
          </ol>
          {canSubmit && (
            <div className="mt-6">
              <ActionButton action={submitForReview}>
                <Send /> Enviar para análise
              </ActionButton>
            </div>
          )}
        </PanelCard>

        <PanelCard title="Registro profissional" description="Deixe em branco se sua profissão não tem conselho (ex.: acompanhante terapêutico). Alterar um registro verificado volta o perfil para análise.">
          <InlineForm action={saveCouncil} submit="Salvar registro" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_100px]">
              <div className="space-y-1.5">
                <Label htmlFor="councilName">Conselho</Label>
                <Input id="councilName" name="councilName" placeholder="CRP, CRFa, CREFITO…" defaultValue={pro.councilName ?? ""} disabled={locked} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="councilNumber">Número</Label>
                <Input id="councilNumber" name="councilNumber" defaultValue={pro.councilNumber ?? ""} disabled={locked} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="councilUf">UF</Label>
                <Input id="councilUf" name="councilUf" maxLength={2} defaultValue={pro.councilUf ?? ""} disabled={locked} />
              </div>
            </div>
          </InlineForm>
        </PanelCard>

        <PanelCard title="Documentos" description="Registro no conselho (ou certificado), documento com foto e certificados de formação.">
          {!docs.length && <p className="text-sm text-muted-foreground">Nenhum documento enviado.</p>}
          <ul className="divide-y">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3">
                <FileText className="size-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.kind} · {formatDate(d.createdAt)}
                  </p>
                </div>
                {!locked && (
                  <ActionButton action={removeDocument.bind(null, d.id)} variant="ghost" size="icon-sm" label="Remover documento">
                    <Trash2 />
                  </ActionButton>
                )}
              </li>
            ))}
          </ul>
          <DocumentUploader disabled={locked} />
        </PanelCard>

        <PanelCard title="Formação" description="Aparece no seu perfil. Certificados aprovados pela moderação ganham o selo “comprovada”.">
          <ul className="divide-y">
            {education.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.institution} · {e.year}
                  </p>
                </div>
                {e.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <BadgeCheck className="size-4" /> Comprovada
                  </span>
                )}
                <ActionButton action={removeEducation.bind(null, e.id)} variant="ghost" size="icon-sm" label="Remover formação">
                  <Trash2 />
                </ActionButton>
              </li>
            ))}
          </ul>
          <InlineForm action={addEducation} submit="Adicionar formação" className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-[2fr_2fr_100px]">
              <Input name="title" placeholder="Curso" aria-label="Curso" required />
              <Input name="institution" placeholder="Instituição" aria-label="Instituição" required />
              <Input name="year" type="number" placeholder="Ano" aria-label="Ano" required />
            </div>
          </InlineForm>
        </PanelCard>
      </div>
    </>
  );
};

export default VerificacaoPage;
