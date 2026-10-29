import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";

const notifications = ["Nova solicitação de contato", "Nova avaliação", "Plano perto de vencer", "Novidades do Fulltime"];

const ContaPage = () => (
  <>
    <PanelHeader title="Conta" />
    <div className="space-y-6">
      <PanelCard title="Acesso">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" defaultValue="ana.paula@exemplo.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pwd">Nova senha</Label>
            <Input id="pwd" type="password" placeholder="Mínimo 8 caracteres" />
          </div>
        </div>
        <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border p-4">
          <span>
            <span className="block font-medium">Verificação em duas etapas</span>
            <span className="text-sm text-muted-foreground">Código por aplicativo autenticador</span>
          </span>
          <Switch />
        </label>
      </PanelCard>

      <PanelCard title="Notificações por e-mail">
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li key={n}>
              <label className="flex items-center justify-between gap-4 text-sm">
                {n}
                <Switch defaultChecked={i < 3} />
              </label>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title="Privacidade e dados">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download /> Exportar meus dados
          </Button>
          <Button variant="outline">Desativar perfil</Button>
          <Button variant="destructive">Excluir conta</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A exclusão remove o perfil público em até 24 h. Pedidos ficam guardados pelo prazo exigido pela lei fiscal.
        </p>
      </PanelCard>
    </div>
  </>
);

export default ContaPage;
