"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cities, conditions, specialties } from "@/lib/mock/catalog";

export const HeroSearch = () => {
  const router = useRouter();

  const submit = (form: FormData) => {
    const qs = new URLSearchParams();
    for (const key of ["especialidade", "condicao", "cidade"]) {
      const v = form.get(key);
      if (v) qs.set(key, String(v));
    }
    router.push(`/buscar?${qs}`);
  };

  return (
    <form
      action={submit}
      className="mx-auto mt-10 grid max-w-4xl gap-2 rounded-2xl border bg-card p-3 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <NativeSelect name="especialidade" aria-label="Especialidade" className="w-full">
        <NativeSelectOption value="">Qualquer especialidade</NativeSelectOption>
        {specialties.map((s) => (
          <NativeSelectOption key={s}>{s}</NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect name="condicao" aria-label="Condição" className="w-full">
        <NativeSelectOption value="">Qualquer condição</NativeSelectOption>
        {conditions.map((c) => (
          <NativeSelectOption key={c}>{c}</NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect name="cidade" aria-label="Cidade" className="w-full">
        <NativeSelectOption value="">Todas as cidades</NativeSelectOption>
        {cities.map((c) => (
          <NativeSelectOption key={c}>{c}</NativeSelectOption>
        ))}
      </NativeSelect>
      <Button type="submit" size="lg">
        <Search /> Buscar
      </Button>
    </form>
  );
};
