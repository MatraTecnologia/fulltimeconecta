import { cn } from "@/lib/utils";

export const PanelHeader = ({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {description && <p className="mt-1 text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);

export const PanelCard = ({ title, description, children, className }: { title?: string; description?: string; children: React.ReactNode; className?: string }) => (
  <section className={cn("rounded-2xl border bg-card p-6", className)}>
    {title && <h2 className="text-lg font-bold">{title}</h2>}
    {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
    <div className={cn(title && "mt-4")}>{children}</div>
  </section>
);

export const Stat = ({ label, value, delta }: { label: string; value: string; delta?: string }) => (
  <div className="rounded-2xl border bg-card p-5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 font-heading text-3xl font-extrabold">{value}</p>
    {delta && <p className="mt-1 text-xs font-medium text-[oklch(0.5_0.1_154)]">{delta}</p>}
  </div>
);
