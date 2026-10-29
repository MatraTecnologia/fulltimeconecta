import { BadgeCheck, Clock, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { cn } from "@/lib/utils";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const timeline = [
  { label: "Enviado", date: "12/01/2026", done: true },
  { label: "Em análise", date: "12/01/2026", done: true },
  { label: "Aprovado", date: "13/01/2026", done: true },
  { label: "Revalidação anual", date: "13/01/2027", done: false },
];

const docs = [
  { name: `Registro ${pro.council?.name} ${pro.council?.number}/${pro.council?.uf}`, kind: "Conselho", status: "Aprovado" },
  { name: "Documento com foto (CNH)", kind: "Identidade", status: "Aprovado" },
  ...pro.education.map((e) => ({ name: `${e.title} · ${e.institution}`, kind: "Formação", status: e.verified ? "Aprovado" : "Pendente" })),
];

const VerificacaoPage = () => (
  <>
    <PanelHeader title="Verificação" description="Só perfis verificados aparecem na busca" />
    <div className="space-y-6">
      <PanelCard>
        <div className="flex items-center gap-3">
          <BadgeCheck className="size-10 text-primary" />
          <div>
            <p className="font-heading text-xl font-bold">Registro verificado</p>
            <p className="text-sm text-muted-foreground">Conferido na consulta pública do CRFa em 13/01/2026</p>
          </div>
        </div>
        <ol className="mt-6 grid gap-4 sm:grid-cols-4">
          {timeline.map((t) => (
            <li key={t.label} className="space-y-1">
              <div className={cn("h-1.5 rounded-full", t.done ? "bg-primary" : "bg-muted")} />
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.date}</p>
            </li>
          ))}
        </ol>
      </PanelCard>

      <PanelCard title="Documentos enviados" description="Certificados aprovados ganham o selo “comprovada” no seu portfólio. Análise em até 2 dias úteis.">
        <ul className="divide-y">
          {docs.map((d) => (
            <li key={d.name} className="flex items-center gap-3 py-3">
              <FileText className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.kind}</p>
              </div>
              {d.status === "Aprovado" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <BadgeCheck className="size-4" /> Aprovado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.55_0.12_70)]">
                  <Clock className="size-4" /> Envie o certificado
                </span>
              )}
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-4">
          <Upload /> Enviar certificado
        </Button>
      </PanelCard>
    </div>
  </>
);

export default VerificacaoPage;
