import { Suspense } from "react";
import type { Metadata } from "next";
import { listVerified } from "@/lib/server/professionals";
import { SearchClient } from "./search-client";

export const metadata: Metadata = { title: "Buscar profissionais · Fulltime" };

type SP = PageProps<"/buscar">["searchParams"];

const Search = async ({ searchParams }: { searchParams: SP }) => {
  const sp = await searchParams;
  const professionals = await listVerified();
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return <SearchClient professionals={professionals} initial={{ specialty: pick("especialidade"), condition: pick("condicao"), city: pick("cidade") }} />;
};

const BuscarPage = ({ searchParams }: PageProps<"/buscar">) => (
  <Suspense fallback={<div className="mx-auto h-96 max-w-6xl px-4 py-8" />}>
    <Search searchParams={searchParams} />
  </Suspense>
);

export default BuscarPage;
