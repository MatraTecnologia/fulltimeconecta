import Link from "next/link";
import { BadgeCheck, Bot, MessageCircle, Search, ShieldCheck, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/professional/professional-card";
import { HeroSearch } from "@/components/site/hero-search";
import { conditions, specialties } from "@/lib/mock/catalog";
import { professionals } from "@/lib/mock/professionals";

const conditionColors = [
  "bg-brand-coral/15 hover:bg-brand-coral/25",
  "bg-brand-amber/20 hover:bg-brand-amber/30",
  "bg-brand-sage/20 hover:bg-brand-sage/30",
  "bg-brand-sky/15 hover:bg-brand-sky/25",
  "bg-brand-lilac/15 hover:bg-brand-lilac/25",
];

const steps = [
  { icon: Search, title: "Busque", text: "Filtre por condição, idade, abordagem, convênio e modalidade." },
  { icon: BadgeCheck, title: "Compare", text: "Veja registro verificado, formações e o portfólio de cada profissional." },
  { icon: MessageCircle, title: "Converse", text: "Chame direto no WhatsApp ou envie uma solicitação pelo formulário." },
];

const trust = [
  { icon: ShieldCheck, title: "Registro verificado", text: "Conferimos o conselho profissional de cada perfil antes de publicar." },
  { icon: Users, title: "Rede multidisciplinar", text: "Fono, TO, psicologia, neuro e mais, em um só lugar." },
  { icon: Bot, title: "Assistente para famílias", text: "Não sabe por onde começar? O assistente indica quais especialidades procurar." },
];

const HomePage = () => (
  <>
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center md:pt-24">
        <p className="mx-auto mb-4 w-fit rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
          Profissionais da neurodiversidade
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold text-balance md:text-6xl">
          O profissional certo para quem você ama, <span className="text-primary">perto de você</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Encontre fonoaudiólogos, terapeutas ocupacionais, psicólogos e médicos especializados em TEA, TDAH, dislexia e outras
          neurodivergências, todos com registro verificado.
        </p>
        <HeroSearch />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4">
      <h2 className="text-2xl font-bold">Buscar por condição</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {conditions.map((c, i) => (
          <Link
            key={c}
            href={`/buscar?condicao=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${conditionColors[i % conditionColors.length]}`}
          >
            {c}
          </Link>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-bold">Buscar por especialidade</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {specialties.map((s) => (
          <Link
            key={s}
            href={`/buscar?especialidade=${encodeURIComponent(s)}`}
            className="rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            {s}
          </Link>
        ))}
      </div>
    </section>

    <section id="como-funciona" className="mx-auto mt-20 max-w-6xl px-4">
      <h2 className="text-center text-3xl font-bold">Como funciona</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                {i + 1}
              </span>
              <s.icon className="size-5 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
            <p className="mt-1 text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto mt-20 max-w-6xl px-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold">Profissionais em destaque</h2>
        <Link href="/buscar" className={buttonVariants({ variant: "link" })}>
          Ver todos
        </Link>
      </div>
      <div className="mt-4 grid gap-4">
        {professionals
          .filter((p) => p.plan !== "gratuito")
          .slice(0, 3)
          .map((p) => (
            <ProfessionalCard key={p.slug} pro={p} />
          ))}
      </div>
    </section>

    <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
      {trust.map((t) => (
        <div key={t.title} className="space-y-2">
          <t.icon className="size-8 text-primary" />
          <h3 className="text-lg font-bold">{t.title}</h3>
          <p className="text-muted-foreground">{t.text}</p>
        </div>
      ))}
    </section>

    <section className="mx-auto mt-20 max-w-6xl px-4">
      <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:p-12">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold">Você é profissional da neurodiversidade?</h2>
          <p className="mt-2 max-w-xl opacity-90">
            Crie seu portfólio gratuito, mostre suas formações e seja encontrado por famílias da sua cidade.
          </p>
        </div>
        <Link href="/cadastro" className={buttonVariants({ variant: "secondary", size: "lg", className: "px-6" })}>
          Criar perfil grátis
        </Link>
      </div>
    </section>
  </>
);

export default HomePage;
