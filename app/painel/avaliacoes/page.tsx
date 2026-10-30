import { Flag, Star } from "lucide-react";
import { ActionButton } from "@/components/panel/action-button";
import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { reportReview } from "@/app/painel/_actions/reviews";
import { formatDate } from "@/lib/labels";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import { shortName } from "@/lib/server/professionals";
import { ReplyBox } from "./reply-box";

const AvaliacoesPage = async () => {
  const { professional: pro } = await requireProfessional();
  const reviews = await db.review.findMany({
    where: { professionalId: pro.id, hidden: false },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  const avg = (k: "rating" | "acolhimento" | "comunicacao" | "pontualidade") =>
    reviews.length >= 3 ? (reviews.reduce((a, r) => a + r[k], 0) / reviews.length).toFixed(1) : "—";

  return (
    <>
      <PanelHeader title="Avaliações" description="Só famílias que entraram em contato há mais de 7 dias podem avaliar. A nota aparece a partir de 3 avaliações." />
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Nota geral" value={avg("rating")} />
        <Stat label="Acolhimento" value={avg("acolhimento")} />
        <Stat label="Comunicação com a família" value={avg("comunicacao")} />
        <Stat label="Pontualidade" value={avg("pontualidade")} />
      </div>
      <div className="mt-6 space-y-4">
        {!reviews.length && <p className="text-sm text-muted-foreground">Você ainda não recebeu avaliações.</p>}
        {reviews.map((r) => (
          <PanelCard key={r.id}>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{shortName(r.author.name)}</span>
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`size-4 ${i < r.rating ? "fill-brand-amber text-brand-amber" : "text-border"}`} />
                ))}
              </span>
              <span className="text-muted-foreground">{formatDate(r.createdAt)}</span>
              <span className="ml-auto">
                <ActionButton action={reportReview.bind(null, r.id)} variant="ghost" size="sm">
                  <Flag /> Denunciar
                </ActionButton>
              </span>
            </div>
            <p className="mt-2">{r.text}</p>
            <ReplyBox id={r.id} reply={r.reply} />
          </PanelCard>
        ))}
      </div>
    </>
  );
};

export default AvaliacoesPage;
