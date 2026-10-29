import Image from "next/image";
import Link from "next/link";

const cols = [
  { title: "Famílias", links: [["Buscar profissionais", "/buscar"], ["Assistente", "/assistente"], ["Como funciona", "/#como-funciona"]] },
  { title: "Profissionais", links: [["Cadastrar perfil", "/cadastro"], ["Planos", "/planos"], ["Entrar no painel", "/entrar"]] },
  { title: "Institucional", links: [["Termos de uso", "#"], ["Privacidade", "#"], ["Cancelamento e reembolso", "#"]] },
];

export const SiteFooter = () => (
  <footer className="mt-24 border-t bg-muted/50">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="space-y-3">
        <Image src="/brand/icon.svg" alt="" width={586} height={567} className="h-10 w-auto dark:hidden" />
        <Image src="/brand/icon-dark.svg" alt="" width={586} height={567} className="hidden h-10 w-auto dark:block" />
        <p className="max-w-xs text-sm text-muted-foreground">
          O Fulltime divulga e aproxima profissionais e famílias. Não presta atendimento nem faz diagnóstico.
        </p>
      </div>
      {cols.map((c) => (
        <div key={c.title} className="space-y-3">
          <p className="font-heading font-bold">{c.title}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {c.links.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <p className="border-t py-4 text-center text-xs text-muted-foreground">© 2026 Fulltime · Matra Tecnologia</p>
  </footer>
);
