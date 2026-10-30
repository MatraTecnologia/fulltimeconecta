"use client";

import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { ProfessionalCard } from "@/components/professional/professional-card";
import { ageRanges, approaches, cities, conditions, healthPlans, modalities, specialties } from "@/lib/catalog";
import type { Professional } from "@/lib/types";

type Sort = "relevancia" | "nota";

const CheckGroup = ({ title, options, value, onChange }: { title: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) => (
  <fieldset className="space-y-2">
    <legend className="mb-2 text-sm font-semibold">{title}</legend>
    {options.map((o) => (
      <label key={o} className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox checked={value.includes(o)} onCheckedChange={(c) => onChange(c ? [...value, o] : value.filter((x) => x !== o))} />
        {o}
      </label>
    ))}
  </fieldset>
);

export const SearchClient = ({ professionals, initial }: { professionals: Professional[]; initial: { specialty: string; condition: string; city: string } }) => {
  const [specialty, setSpecialty] = useState(initial.specialty);
  const [condition, setCondition] = useState(initial.condition);
  const [city, setCity] = useState(initial.city);
  const [ages, setAges] = useState<string[]>([]);
  const [apps, setApps] = useState<string[]>([]);
  const [mods, setMods] = useState<string[]>([]);
  const [plansSel, setPlansSel] = useState<string[]>([]);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("relevancia");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const hasAny = (list: string[], sel: string[]) => sel.length === 0 || sel.some((s) => list.includes(s));
    const list = professionals.filter(
      (p) =>
        (!specialty || p.specialty === specialty) &&
        (!condition || p.conditions.includes(condition)) &&
        (!city || p.city === city) &&
        hasAny(p.ageRanges, ages) &&
        hasAny(p.approaches, apps) &&
        hasAny(p.modalities, mods) &&
        hasAny(p.healthPlans, plansSel) &&
        (!onlyOpen || p.vacancy === "aberta"),
    );
    if (sort === "nota") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [professionals, specialty, condition, city, ages, apps, mods, plansSel, onlyOpen, sort]);

  const clear = () => {
    setSpecialty("");
    setCondition("");
    setCity("");
    setAges([]);
    setApps([]);
    setMods([]);
    setPlansSel([]);
    setOnlyOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Buscar profissionais</h1>
      <div className="mt-6 grid gap-2 md:grid-cols-3">
        <NativeSelect value={specialty} onChange={(e) => setSpecialty(e.target.value)} aria-label="Especialidade" className="w-full">
          <NativeSelectOption value="">Qualquer especialidade</NativeSelectOption>
          {specialties.map((s) => (
            <NativeSelectOption key={s}>{s}</NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect value={condition} onChange={(e) => setCondition(e.target.value)} aria-label="Condição" className="w-full">
          <NativeSelectOption value="">Qualquer condição</NativeSelectOption>
          {conditions.map((c) => (
            <NativeSelectOption key={c}>{c}</NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect value={city} onChange={(e) => setCity(e.target.value)} aria-label="Cidade" className="w-full">
          <NativeSelectOption value="">Todas as cidades</NativeSelectOption>
          {cities.map((c) => (
            <NativeSelectOption key={c}>{c}</NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} space-y-6 md:block`}>
          <label className="flex items-center justify-between gap-2 text-sm font-semibold">
            Só com vaga aberta
            <Switch checked={onlyOpen} onCheckedChange={setOnlyOpen} />
          </label>
          <CheckGroup title="Faixa etária" options={ageRanges} value={ages} onChange={setAges} />
          <CheckGroup title="Modalidade" options={modalities} value={mods} onChange={setMods} />
          <CheckGroup title="Abordagem" options={approaches} value={apps} onChange={setApps} />
          <CheckGroup title="Convênio" options={healthPlans} value={plansSel} onChange={setPlansSel} />
          <Button variant="outline" className="w-full" onClick={clear}>
            Limpar filtros
          </Button>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{results.length}</strong> profissionais encontrados
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="md:hidden" onClick={() => setShowFilters((v) => !v)}>
                <SlidersHorizontal /> Filtros
              </Button>
              <NativeSelect value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Ordenar">
                <NativeSelectOption value="relevancia">Relevância</NativeSelectOption>
                <NativeSelectOption value="nota">Melhor avaliados</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          {results.length ? (
            <div className="grid gap-4">
              {results.map((p) => (
                <ProfessionalCard key={p.slug} pro={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <p className="font-heading text-lg font-bold">Nenhum profissional com esses filtros</p>
              <p className="max-w-sm text-sm text-muted-foreground">Tente outra cidade ou inclua a modalidade online.</p>
              <Button variant="outline" onClick={clear}>
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
