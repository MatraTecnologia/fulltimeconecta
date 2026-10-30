import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { PanelNav } from "@/components/panel/panel-nav";
import { PlanBadge, ProAvatar } from "@/components/professional/pro-badges";
import { SignOutButton } from "@/components/site/sign-out-button";
import { db } from "@/lib/server/db";
import { requireProfessional } from "@/lib/server/dal";
import type { Accent, Plan } from "@/lib/types";

const HeaderUser = async () => {
  const { professional: pro } = await requireProfessional();
  return (
    <>
      {pro.status === "VERIFICADO" && (
        <Link href={`/p/${pro.slug}`} className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
          <ExternalLink /> Ver perfil público
        </Link>
      )}
      <div className="scale-75">
        <ProAvatar pro={{ name: pro.name, accent: pro.accent as Accent, avatarUrl: pro.avatarUrl }} />
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-sm font-semibold">{pro.name}</p>
        <PlanBadge plan={pro.plan.toLowerCase() as Plan} />
      </div>
      <SignOutButton />
    </>
  );
};

const Nav = async () => {
  const { professional: pro } = await requireProfessional();
  const newLeads = await db.lead.count({ where: { professionalId: pro.id, status: "NOVO" } });
  return <PanelNav newLeads={newLeads} />;
};

const PainelLayout = ({ children }: LayoutProps<"/painel">) => (
  <>
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo href="/painel" />
        <div className="ml-auto flex items-center gap-3">
          <Suspense>
            <HeaderUser />
          </Suspense>
        </div>
      </div>
    </header>
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-6 md:self-start">
        <Suspense fallback={<PanelNav />}>
          <Nav />
        </Suspense>
      </aside>
      <main className="min-w-0 pb-16">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando…</p>}>{children}</Suspense>
      </main>
    </div>
  </>
);

export default PainelLayout;
