import { PanelHeader } from "@/components/panel/panel-ui";
import { LeadsTable } from "./leads-table";

const LeadsPage = () => (
  <>
    <PanelHeader title="Contatos" description="Cliques no WhatsApp e solicitações pelo formulário. Dados ficam guardados por 12 meses." />
    <LeadsTable />
  </>
);

export default LeadsPage;
