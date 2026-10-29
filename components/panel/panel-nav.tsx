"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BadgeCheck, CreditCard, Home, Images, Inbox, Settings, Star, Stethoscope, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/painel", label: "Início", icon: Home },
  { href: "/painel/perfil", label: "Meu perfil", icon: UserRound },
  { href: "/painel/atendimento", label: "Atendimento", icon: Stethoscope },
  { href: "/painel/verificacao", label: "Verificação", icon: BadgeCheck },
  { href: "/painel/portfolio", label: "Portfólio", icon: Images },
  { href: "/painel/leads", label: "Contatos", icon: Inbox, badge: 2 },
  { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/painel/estatisticas", label: "Estatísticas", icon: BarChart3 },
  { href: "/painel/plano", label: "Plano", icon: CreditCard },
  { href: "/painel/conta", label: "Conta", icon: Settings },
];

export const PanelNav = () => {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => {
        const active = i.href === "/painel" ? path === i.href : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <i.icon className="size-4" />
            {i.label}
            {i.badge && (
              <span className={cn("ml-auto rounded-full px-1.5 text-xs", active ? "bg-primary-foreground/20" : "bg-brand-coral text-white")}>
                {i.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
