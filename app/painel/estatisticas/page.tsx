import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { StatsChart } from "./stats-chart";
import { searchTerms } from "@/lib/mock/panel";

const max = Math.max(...searchTerms.map((t) => t.count));

const EstatisticasPage = () => (
  <>
    <PanelHeader title="Estatísticas" description="Últimas 8 semanas" />
    <div className="space-y-6">
      <PanelCard title="Visitas, cliques e solicitações por semana" description="As visitas mais que dobraram em 8 semanas, de 142 para 341">
        <StatsChart />
      </PanelCard>
      <PanelCard title="Buscas que trouxeram famílias até você">
        <ul className="space-y-3">
          {searchTerms.map((t) => (
            <li key={t.term} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-sm">
              <span>{t.term}</span>
              <span className="font-semibold tabular-nums">{t.count}</span>
              <div className="col-span-2 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(t.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  </>
);

export default EstatisticasPage;
