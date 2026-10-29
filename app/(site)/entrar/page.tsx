import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/site/auth-shell";

export const metadata: Metadata = { title: "Entrar · NeuroConecta" };

const EntrarPage = () => (
  <AuthShell
    title="Entre na sua conta"
    subtitle="Acesse o painel do seu perfil"
    footer={
      <>
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Cadastre-se grátis
        </Link>
      </>
    }
  >
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" defaultValue="ana.paula@exemplo.com" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label htmlFor="pwd">Senha</Label>
          <Link href="#" className="text-sm text-primary hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <Input id="pwd" type="password" defaultValue="12345678" />
      </div>
      <Link href="/painel" className={buttonVariants({ size: "lg", className: "w-full" })}>
        Entrar
      </Link>
      <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full text-muted-foreground" })}>
        Entrar como moderador (demo)
      </Link>
    </div>
  </AuthShell>
);

export default EntrarPage;
