import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { PanelNav } from "@/components/panel/panel-nav";
import { PlanBadge, ProAvatar } from "@/components/professional/pro-badges";
import { PrototypeBanner } from "@/components/site/prototype-banner";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const PainelLayout = ({ children }: LayoutProps<"/painel">) => (
  <>
    <PrototypeBanner />
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo href="/painel" />
        <div className="ml-auto flex items-center gap-3">
          <Link href={`/p/${pro.slug}`} className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
            <ExternalLink /> Ver perfil público
          </Link>
          <div className="scale-75">
            <ProAvatar pro={pro} />
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{pro.name}</p>
            <PlanBadge plan="premium" />
          </div>
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="Sair">
            <LogOut />
          </Link>
        </div>
      </div>
    </header>
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-6 md:self-start">
        <PanelNav />
      </aside>
      <main className="min-w-0 pb-16">{children}</main>
    </div>
  </>
);

export default PainelLayout;
