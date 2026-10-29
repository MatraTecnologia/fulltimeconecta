import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, Flag, GraduationCap, Languages, MapPin, MessageCircle, Star, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Chip, PlanBadge, ProAvatar, VacancyBadge, VerifiedBadge } from "@/components/professional/pro-badges";
import { whatsappUrl } from "@/components/professional/professional-card";
import { YoutubeIcon } from "@/components/professional/social-icons";
import { SocialLinks } from "@/components/professional/social-links";
import { VideoPlayer } from "@/components/professional/video-player";
import { ContactForm } from "./contact-form";
import { reviews } from "@/lib/mock/panel";
import { findProfessional, professionals } from "@/lib/mock/professionals";

export const generateStaticParams = () => professionals.map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({ params }: PageProps<"/p/[slug]">): Promise<Metadata> => {
  const pro = findProfessional((await params).slug);
  return { title: pro ? `${pro.name} · ${pro.specialty} em ${pro.city} · Fulltime` : "Perfil · Fulltime" };
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border bg-card p-6">
    <h2 className="mb-4 text-xl font-bold">{title}</h2>
    {children}
  </section>
);

const ChipRow = ({ label, items }: { label: string; items: string[] }) =>
  items.length ? (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Chip key={i}>{i}</Chip>
        ))}
      </div>
    </div>
  ) : null;

const ProfilePage = async ({ params }: PageProps<"/p/[slug]">) => {
  const pro = findProfessional((await params).slug);
  if (!pro) notFound();
  const showRating = pro.rating && pro.reviewsCount >= 3;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/buscar" className="text-sm text-muted-foreground hover:text-foreground">
        ← Voltar para a busca
      </Link>

      <header className="mt-4 flex flex-col gap-6 rounded-3xl border bg-card p-6 md:flex-row md:items-center md:p-8">
        <ProAvatar pro={pro} size="lg" />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-extrabold">{pro.name}</h1>
            <PlanBadge plan={pro.plan} />
          </div>
          <p className="text-lg text-muted-foreground">{pro.specialty}</p>
          <VerifiedBadge pro={pro} />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" /> {pro.neighborhood}, {pro.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> Responde em ~{pro.responseHours} h
            </span>
            {showRating && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-brand-amber text-brand-amber" /> {pro.rating!.toFixed(1)} · {pro.reviewsCount} avaliações
              </span>
            )}
          </div>
          <div className="pt-2">
            <SocialLinks social={pro.social} />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-56">
          <div className="self-start md:self-center">
            <VacancyBadge vacancy={pro.vacancy} />
          </div>
          <a href={whatsappUrl(pro)} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
            <MessageCircle /> Chamar no WhatsApp
          </a>
          <a href="#contato" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Enviar solicitação
          </a>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Sobre">
            <p className="leading-relaxed">{pro.bio}</p>
            <p className="mt-3 text-sm text-muted-foreground">{pro.years} anos de experiência</p>
          </Section>

          {pro.videos.length > 0 && (
            <Section title="Vídeos">
              <VideoPlayer video={pro.videos[0]} large />
              {pro.videos.length > 1 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {pro.videos.slice(1).map((v, i) => (
                    <VideoPlayer key={v.title} video={v} index={i + 1} />
                  ))}
                </div>
              )}
              {pro.social.youtube && (
                <a
                  href={`https://youtube.com/@${pro.social.youtube}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <YoutubeIcon className="size-4" /> Ver canal completo no YouTube
                </a>
              )}
            </Section>
          )}

          <Section title="Atendimento">
            <div className="grid gap-5 sm:grid-cols-2">
              <ChipRow label="Condições atendidas" items={pro.conditions} />
              <ChipRow label="Faixa etária" items={pro.ageRanges} />
              <ChipRow label="Abordagens" items={pro.approaches} />
              <ChipRow label="Modalidades" items={pro.modalities} />
              <ChipRow label="Convênios" items={pro.healthPlans} />
            </div>
          </Section>

          <Section title="Formação">
            <ul className="space-y-3">
              {pro.education.map((e) => (
                <li key={e.title} className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 size-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.institution} · {e.year}
                    </p>
                  </div>
                  {e.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <BadgeCheck className="size-4" /> Comprovada
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          {pro.portfolio.length > 0 && (
            <Section title="Portfólio">
              <div className="grid gap-3 sm:grid-cols-2">
                {pro.portfolio.map((i) => (
                  <div key={i.title} className="rounded-xl bg-muted p-4">
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">{i.type}</p>
                    <p className="mt-1 font-medium">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.detail}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Avaliações de famílias">
            {showRating ? (
              <ul className="space-y-5">
                {reviews.map((r) => (
                  <li key={r.id} className="space-y-1 border-b pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{r.author}</span>
                      <span className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-brand-amber text-brand-amber" : "text-border"}`} />
                        ))}
                      </span>
                      <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <p>{r.text}</p>
                    {r.reply && <p className="ml-4 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Resposta: {r.reply}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">A nota aparece a partir de 3 avaliações.</p>
            )}
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="Informações">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Wallet className="size-4 text-primary" />
                {pro.price ? `Sessão a partir de R$ ${pro.price}` : "Valor sob consulta"}
              </li>
              <li className="flex items-center gap-2">
                <Languages className="size-4 text-primary" />
                {pro.languages.join(", ")}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {pro.neighborhood}, {pro.city}
              </li>
            </ul>
            <div className="mt-4 flex h-36 items-center justify-center rounded-xl bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_10px,var(--background)_10px,var(--background)_20px)] text-sm text-muted-foreground">
              Mapa do local
            </div>
          </Section>

          <div id="contato">
            <Section title="Enviar solicitação">
              <ContactForm name={pro.name.split(" ")[0]} />
            </Section>
          </div>

          <p className="text-xs text-muted-foreground">
            O Fulltime aproxima famílias e profissionais. Confirme valores e condições diretamente antes de contratar.
          </p>
          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
            <Flag className="size-3.5" /> Denunciar perfil
          </button>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
