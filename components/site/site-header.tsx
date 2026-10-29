import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/buscar", label: "Buscar profissionais" },
  { href: "/assistente", label: "Assistente" },
  { href: "/planos", label: "Planos" },
];

export const SiteHeader = () => (
  <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
      <Logo />
      <nav className="hidden items-center gap-1 md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={buttonVariants({ variant: "ghost" })}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/buscar" className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })} aria-label="Buscar profissionais">
          <Search />
        </Link>
        <Link href="/entrar" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>
          Entrar
        </Link>
        <Link href="/cadastro" className={buttonVariants()}>
          <span className="sm:hidden">Profissional</span>
          <span className="hidden sm:inline">Sou profissional</span>
        </Link>
      </div>
    </div>
  </header>
);
