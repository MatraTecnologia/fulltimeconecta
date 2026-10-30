import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { requireProfessional } from "@/lib/server/dal";
import { DeleteForm } from "./delete-form";
import { PasswordForm } from "./password-form";

const ContaPage = async () => {
  const { user } = await requireProfessional();
  return (
    <>
      <PanelHeader title="Conta" description={`Conectado como ${user.email}`} />
      <div className="space-y-6">
        <PanelCard title="Senha">
          <PasswordForm />
        </PanelCard>

        <PanelCard title="Privacidade e dados">
          <a href="/api/conta/exportar" className={buttonVariants({ variant: "outline" })}>
            <Download /> Exportar meus dados
          </a>
          <div className="mt-6 border-t pt-6">
            <p className="mb-3 text-sm font-medium">Excluir conta</p>
            <DeleteForm />
            <p className="mt-3 text-xs text-muted-foreground">
              Remove o perfil público, fotos, vídeos, documentos e contatos na hora. Essa ação não pode ser desfeita.
            </p>
          </div>
        </PanelCard>
      </div>
    </>
  );
};

export default ContaPage;
