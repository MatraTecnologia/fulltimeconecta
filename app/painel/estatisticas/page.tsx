import { PanelCard, PanelHeader, Stat } from "@/components/panel/panel-ui";
import { requireProfessional } from "@/lib/server/dal";
import { weekly } from "@/lib/server/stats";
import { StatsChart } from "./stats-chart";

const EstatisticasPage = async () => {
  const { professional: pro } = await requireProfessional();
  const data = await weekly(pro.id);
  const total = (k: "views" | "clicks" | "leads") => data.reduce((a, w) => a + w[k], 0);
  const views = total("views");
  const contacts = total("clicks") + total("leads");
  const first = data[0].views;
  const last = data[data.length - 1].views;

  return (
    <>
      <PanelHeader title="Estatísticas" description="Últimas 8 semanas" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Visitas ao perfil" value={views.toLocaleString("pt-BR")} />
        <Stat label="Contatos (WhatsApp + formulário)" value={contacts.toLocaleString("pt-BR")} />
        <Stat label="Taxa de contato" value={views ? `${((contacts / views) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "—"} />
      </div>
      <PanelCard
        className="mt-6"
        title="Visitas, cliques e solicitações por semana"
        description={views ? `Visitas na primeira semana: ${first} · na última: ${last}` : "Os números aparecem assim que seu perfil começar a receber visitas."}
      >
        <StatsChart data={data} />
      </PanelCard>
    </>
  );
};

export default EstatisticasPage;
