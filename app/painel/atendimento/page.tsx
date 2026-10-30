import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ActionForm } from "@/components/panel/action-form";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { ToggleChips } from "@/components/panel/toggle-chips";
import { VacancyPicker } from "@/components/panel/vacancy-picker";
import { saveAtendimento } from "@/app/painel/_actions/profile";
import { ageRanges, approaches, cities, conditions, healthPlans, modalities } from "@/lib/catalog";
import { planLimits } from "@/lib/plan-limits";
import { requireProfessional } from "@/lib/server/dal";
import type { Vacancy } from "@/lib/types";

const AtendimentoPage = async () => {
  const { professional: pro } = await requireProfessional();
  const maxConditions = planLimits[pro.plan].conditions;
  return (
    <>
      <PanelHeader title="Atendimento" description="Esses dados alimentam os filtros da busca" />
      <ActionForm action={saveAtendimento}>
        <div className="space-y-6">
          <PanelCard title="Vagas">
            <VacancyPicker initial={pro.vacancy.toLowerCase() as Vacancy} />
          </PanelCard>
          <PanelCard title="Condições atendidas" description={Number.isFinite(maxConditions) ? `Seu plano: até ${maxConditions}` : "Seu plano: ilimitado"}>
            <ToggleChips name="conditions" options={conditions} initial={pro.conditions} />
          </PanelCard>
          <PanelCard title="Faixa etária">
            <ToggleChips name="ageRanges" options={ageRanges} initial={pro.ageRanges} />
          </PanelCard>
          <PanelCard title="Abordagens" description="Certificados aprovados ganham o selo “comprovada” no portfólio">
            <ToggleChips name="approaches" options={approaches} initial={pro.approaches} />
          </PanelCard>
          <PanelCard title="Modalidades">
            <ToggleChips name="modalities" options={modalities} initial={pro.modalities} />
          </PanelCard>
          <PanelCard title="Convênios aceitos">
            <ToggleChips name="healthPlans" options={healthPlans} initial={pro.healthPlans} />
          </PanelCard>
          <PanelCard title="Valor da sessão" description="Opcional. Deixe vazio para exibir “sob consulta”.">
            <div className="max-w-48 space-y-1.5">
              <Label htmlFor="price">A partir de (R$)</Label>
              <Input id="price" name="price" type="number" min={0} defaultValue={pro.price ?? ""} />
            </div>
          </PanelCard>
          <PanelCard title="Local de atendimento">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade</Label>
                <NativeSelect id="city" name="city" defaultValue={pro.city} className="w-full">
                  <NativeSelectOption value="">Selecione</NativeSelectOption>
                  {cities.map((c) => (
                    <NativeSelectOption key={c}>{c}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" name="neighborhood" defaultValue={pro.neighborhood} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Endereço (opcional)</Label>
                <Input id="address" name="address" defaultValue={pro.address ?? ""} placeholder="Rua, número, sala" />
              </div>
            </div>
          </PanelCard>
        </div>
      </ActionForm>
    </>
  );
};

export default AtendimentoPage;
