import { ImagePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { VideoManager } from "@/components/panel/video-manager";
import { SaveBar } from "@/components/panel/save-bar";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const photos = ["Recepção", "Sala de atendimento", "Materiais de CAA", "Sala sensorial"];
const tints = ["bg-brand-coral/15", "bg-brand-sky/15", "bg-brand-sage/20", "bg-brand-lilac/15"];

const PortfolioPage = () => (
  <>
    <PanelHeader title="Portfólio" description="Mostre seu espaço, seus cursos e o que você publica" />
    <div className="space-y-6">
      <PanelCard title="Galeria" description={`${photos.length} de 12 fotos (Premium)`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={p} className={`flex aspect-square items-end rounded-xl p-3 text-sm font-medium ${tints[i]}`}>
              {p}
            </div>
          ))}
          <button className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:bg-muted">
            <ImagePlus className="size-6" /> Adicionar
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Fotos com crianças identificáveis exigem termo de autorização do responsável.</p>
      </PanelCard>

      <PanelCard title="Vídeos" description="O primeiro vídeo aparece em destaque no seu perfil. Premium: até 6 vídeos.">
        <VideoManager initial={pro.videos} limit={6} />
      </PanelCard>

      <PanelCard title="Cursos, artigos e eventos">
        <ul className="space-y-3">
          {pro.portfolio.map((i) => (
            <li key={i.title} className="flex items-center gap-3 rounded-xl border p-4">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">{i.type}</span>
              <div className="flex-1">
                <p className="font-medium">{i.title}</p>
                <p className="text-sm text-muted-foreground">{i.detail}</p>
              </div>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-3">
          <Plus /> Novo item
        </Button>
      </PanelCard>
    </div>
    <SaveBar />
  </>
);

export default PortfolioPage;
