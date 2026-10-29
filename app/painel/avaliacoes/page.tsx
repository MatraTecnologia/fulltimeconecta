import { Star } from "lucide-react";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { ReplyBox } from "./reply-box";
import { reviews } from "@/lib/mock/panel";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const avg = (k: "acolhimento" | "comunicacao" | "pontualidade") => (reviews.reduce((a, r) => a + r.criteria[k], 0) / reviews.length).toFixed(1);

const AvaliacoesPage = () => (
  <>
    <PanelHeader title="Avaliações" description="Só famílias que entraram em contato há mais de 7 dias podem avaliar. Avaliações não podem ser apagadas." />
    <div className="grid gap-4 sm:grid-cols-4">
      <Stat label="Nota geral" value={pro.rating!.toFixed(1)} />
      <Stat label="Acolhimento" value={avg("acolhimento")} />
      <Stat label="Comunicação com a família" value={avg("comunicacao")} />
      <Stat label="Pontualidade" value={avg("pontualidade")} />
    </div>
    <div className="mt-6 space-y-4">
      {reviews.map((r) => (
        <PanelCard key={r.id}>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{r.author}</span>
            <span className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`size-4 ${i < r.rating ? "fill-brand-amber text-brand-amber" : "text-border"}`} />
              ))}
            </span>
            <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString("pt-BR")}</span>
            <button className="ml-auto text-xs text-muted-foreground hover:text-destructive">Denunciar</button>
          </div>
          <p className="mt-2">{r.text}</p>
          <ReplyBox reply={r.reply} />
        </PanelCard>
      ))}
    </div>
  </>
);

export default AvaliacoesPage;
