import Image from "next/image";
import Link from "next/link";

export const AuthShell = ({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) => (
  <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
    <Link href="/" className="mx-auto">
      <Image src="/brand/icon.svg" alt="Fulltime" width={586} height={567} className="h-12 w-auto dark:hidden" />
      <Image src="/brand/icon-dark.svg" alt="Fulltime" width={586} height={567} className="hidden h-12 w-auto dark:block" />
    </Link>
    <p className="mt-6 text-center text-sm font-semibold text-primary">Área profissional</p>
    <h1 className="mt-1 text-center text-3xl font-extrabold">{title}</h1>
    <p className="mt-2 text-center text-muted-foreground">{subtitle}</p>
    <div className="mt-8 rounded-3xl border bg-card p-6">{children}</div>
    <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
  </div>
);
