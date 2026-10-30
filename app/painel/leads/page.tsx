import { PanelHeader } from "@/components/panel/panel-ui";
import { requireProfessional } from "@/lib/server/dal";
import { listRetainedLeads } from "@/lib/server/leads";
import { LeadsTable } from "./leads-table";

const LeadsPage = async () => {
  const { professional: pro } = await requireProfessional();
  const leads = await listRetainedLeads(pro.id);
  return (
    <>
      <PanelHeader title="Contatos" description="Solicitações enviadas pelo formulário do seu perfil. Dados ficam guardados por 12 meses." />
      <LeadsTable
        leads={leads.map((l) => ({
          id: l.id,
          guardian: l.guardian,
          contact: l.contact,
          channel: l.channel,
          personAge: l.personAge,
          condition: l.condition,
          modality: l.modality,
          message: l.message,
          date: l.createdAt.toISOString(),
          status: l.status,
        }))}
      />
    </>
  );
};

export default LeadsPage;
