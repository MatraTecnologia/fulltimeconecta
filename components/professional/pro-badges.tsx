import { BadgeCheck, Crown, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan, Professional, Vacancy } from "@/lib/mock/professionals";

const accents: Record<Professional["accent"], string> = {
  teal: "bg-brand-teal/15 text-brand-teal",
  coral: "bg-brand-coral/15 text-brand-coral",
  amber: "bg-brand-amber/20 text-[oklch(0.55_0.12_70)]",
  lilac: "bg-brand-lilac/15 text-brand-lilac",
  sky: "bg-brand-sky/15 text-brand-sky",
  sage: "bg-brand-sage/20 text-[oklch(0.5_0.09_154)]",
};

const initials = (name: string) =>
  name
    .replace(/^(Dr|Dra)\.\s/, "")
    .split(" ")
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((s) => s[0])
    .join("");

export const ProAvatar = ({ pro, size = "md" }: { pro: Professional; size?: "md" | "lg" }) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-2xl font-heading font-extrabold",
      accents[pro.accent],
      size === "lg" ? "size-28 text-4xl" : "size-16 text-xl",
    )}
    aria-hidden
  >
    {initials(pro.name)}
  </div>
);

export const VerifiedBadge = ({ pro }: { pro: Professional }) =>
  pro.council ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
      <BadgeCheck className="size-4" />
      {pro.council.name} {pro.council.number} verificado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
      <GraduationCap className="size-4" />
      Formação comprovada
    </span>
  );

export const PlanBadge = ({ plan }: { plan: Plan }) =>
  plan === "destaque" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-amber/25 px-2 py-0.5 text-xs font-semibold">
      <Sparkles className="size-3.5" /> Destaque
    </span>
  ) : plan === "premium" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-lilac/15 px-2 py-0.5 text-xs font-semibold text-brand-lilac">
      <Crown className="size-3.5" /> Premium
    </span>
  ) : null;

const vacancyLabel: Record<Vacancy, [string, string]> = {
  aberta: ["Vagas abertas", "bg-brand-sage/20 text-[oklch(0.45_0.09_154)]"],
  espera: ["Lista de espera", "bg-brand-amber/20 text-[oklch(0.5_0.12_70)]"],
  fechada: ["Sem vagas", "bg-muted text-muted-foreground"],
};

export const VacancyBadge = ({ vacancy }: { vacancy: Vacancy }) => (
  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", vacancyLabel[vacancy][1])}>{vacancyLabel[vacancy][0]}</span>
);

export const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("rounded-full border bg-background px-2.5 py-0.5 text-xs", className)}>{children}</span>
);
