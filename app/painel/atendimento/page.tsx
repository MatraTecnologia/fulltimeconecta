import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { SaveBar } from "@/components/panel/save-bar";
import { ToggleChips } from "@/components/panel/toggle-chips";
import { VacancyPicker } from "@/components/panel/vacancy-picker";
import { ageRanges, approaches, conditions, healthPlans, modalities } from "@/lib/mock/catalog";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const AtendimentoPage = () => (
  <>
    <PanelHeader title="Atendimento" description="Esses dados alimentam os filtros da busca" />
    <div className="space-y-6">
      <PanelCard title="Vagas">
        <VacancyPicker initial={pro.vacancy} />
      </PanelCard>
      <PanelCard title="Condições atendidas" description="Premium: ilimitado · Gratuito: até 3">
        <ToggleChips options={conditions} initial={pro.conditions} />
      </PanelCard>
      <PanelCard title="Faixa etária">
        <ToggleChips options={ageRanges} initial={pro.ageRanges} />
      </PanelCard>
      <PanelCard title="Abordagens" description="Certificados aprovados ganham o selo “comprovada” no portfólio">
        <ToggleChips options={approaches} initial={pro.approaches} />
      </PanelCard>
      <PanelCard title="Modalidades">
        <ToggleChips options={modalities} initial={pro.modalities} />
      </PanelCard>
      <PanelCard title="Convênios aceitos">
        <ToggleChips options={healthPlans} initial={pro.healthPlans} />
      </PanelCard>
      <PanelCard title="Valor da sessão" description="Opcional. Deixe vazio para exibir “sob consulta”.">
        <div className="max-w-48 space-y-1.5">
          <Label htmlFor="price">A partir de (R$)</Label>
          <Input id="price" type="number" defaultValue={pro.price ?? ""} />
        </div>
      </PanelCard>
      <PanelCard title="Locais de atendimento" description="Premium: até 3 locais">
        <div className="flex items-start gap-3 rounded-xl border p-4">
          <MapPin className="mt-0.5 size-5 text-primary" />
          <div className="flex-1 text-sm">
            <p className="font-medium">Consultório Gleba Palhano</p>
            <p className="text-muted-foreground">Av. Ayrton Senna, 500, sala 804 · {pro.neighborhood}, {pro.city}</p>
            <p className="mt-1 text-xs text-muted-foreground">Exibição: endereço completo</p>
          </div>
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        </div>
        <Button variant="outline" className="mt-3">
          <Plus /> Adicionar local
        </Button>
      </PanelCard>
    </div>
    <SaveBar />
  </>
);

export default AtendimentoPage;
