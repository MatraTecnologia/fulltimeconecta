import { Trash2 } from "lucide-react";
import { ActionButton } from "@/components/panel/action-button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { PhotoManager } from "@/components/panel/photo-manager";
import { PortfolioForm } from "@/components/panel/portfolio-form";
import { VideoManager } from "@/components/panel/video-manager";
import { removePortfolioItem } from "@/app/painel/_actions/media";
import { planLimits } from "@/lib/plan-limits";
import { requireProfessional } from "@/lib/server/dal";
import { loadOwnProfessional } from "@/lib/server/professionals";

const PortfolioPage = async () => {
  const { professional } = await requireProfessional();
  const pro = await loadOwnProfessional(professional.id);
  const limits = planLimits[professional.plan];
  return (
    <>
      <PanelHeader title="Portfólio" description="Mostre seu espaço, seus cursos e o que você publica" />
      <div className="space-y-6">
        <PanelCard title="Galeria" description={limits.photos ? `${pro.photos.length} de ${limits.photos} fotos` : undefined}>
          <PhotoManager photos={pro.photos} limit={limits.photos} />
          <p className="mt-3 text-xs text-muted-foreground">Fotos com crianças identificáveis exigem termo de autorização do responsável.</p>
        </PanelCard>

        <PanelCard title="Vídeos" description={limits.videos ? `O primeiro vídeo aparece em destaque no seu perfil. Até ${limits.videos} vídeos.` : undefined}>
          <VideoManager videos={pro.videos} limit={limits.videos} />
        </PanelCard>

        <PanelCard title="Cursos, artigos e eventos">
          <ul className="space-y-3">
            {pro.portfolio.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-xl border p-4">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">{i.type}</span>
                <div className="flex-1">
                  <p className="font-medium">{i.title}</p>
                  <p className="text-sm text-muted-foreground">{i.detail}</p>
                </div>
                <ActionButton action={removePortfolioItem.bind(null, i.id)} variant="ghost" size="icon-sm" label="Remover item">
                  <Trash2 />
                </ActionButton>
              </li>
            ))}
          </ul>
          <PortfolioForm />
        </PanelCard>
      </div>
    </>
  );
};

export default PortfolioPage;
