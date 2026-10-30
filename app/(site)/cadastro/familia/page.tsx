import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";
import { FamilyForm } from "./family-form";

export const metadata: Metadata = { title: "Cadastro de família · Fulltime" };

const Form = async ({ searchParams }: { searchParams: PageProps<"/cadastro/familia">["searchParams"] }) => {
  const { next } = await searchParams;
  return <FamilyForm next={typeof next === "string" ? next : undefined} />;
};

const CadastroFamiliaPage = ({ searchParams }: PageProps<"/cadastro/familia">) => (
  <AuthShell
    eyebrow="Famílias"
    title="Crie sua conta"
    subtitle="Com a conta você acompanha os contatos que enviou e pode avaliar os profissionais"
    footer={
      <>
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </>
    }
  >
    <Suspense>
      <Form searchParams={searchParams} />
    </Suspense>
  </AuthShell>
);

export default CadastroFamiliaPage;
