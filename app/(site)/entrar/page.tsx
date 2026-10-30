import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = { title: "Entrar · Fulltime" };

const Form = async ({ searchParams }: { searchParams: PageProps<"/entrar">["searchParams"] }) => {
  const { next } = await searchParams;
  return <SignInForm next={typeof next === "string" ? next : undefined} />;
};

const EntrarPage = ({ searchParams }: PageProps<"/entrar">) => (
  <AuthShell
    eyebrow="Profissionais e famílias"
    title="Entre na sua conta"
    subtitle="Profissionais acessam o painel; famílias podem avaliar quem já contataram"
    footer={
      <>
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Sou profissional
        </Link>{" "}
        ·{" "}
        <Link href="/cadastro/familia" className="font-semibold text-primary hover:underline">
          Sou família
        </Link>
      </>
    }
  >
    <Suspense>
      <Form searchParams={searchParams} />
    </Suspense>
  </AuthShell>
);

export default EntrarPage;
