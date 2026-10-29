import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Cadastro · Fulltime" };

const CadastroPage = () => (
  <AuthShell
    title="Crie seu perfil grátis"
    subtitle="Em 3 passos seu portfólio entra em análise"
    footer={
      <>
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </>
    }
  >
    <SignupForm />
  </AuthShell>
);

export default CadastroPage;
