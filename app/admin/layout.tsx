import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/site/sign-out-button";
import { requireAdmin } from "@/lib/server/dal";

const Gate = async ({ children }: { children: React.ReactNode }) => {
  await requireAdmin();
  return children;
};

const AdminLayout = ({ children }: LayoutProps<"/admin">) => (
  <>
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Logo href="/admin" />
        <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">Moderação</span>
        <div className="ml-auto">
          <SignOutButton />
        </div>
      </div>
    </header>
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando…</p>}>
        <Gate>{children}</Gate>
      </Suspense>
    </main>
  </>
);

export default AdminLayout;
