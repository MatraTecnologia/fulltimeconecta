import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, GraduationCap, Languages, MapPin, MessageCircle, Star, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Chip, PlanBadge, ProAvatar, VacancyBadge, VerifiedBadge } from "@/components/professional/pro-badges";
import { YoutubeIcon } from "@/components/professional/social-icons";
import { SocialLinks } from "@/components/professional/social-links";
import { VideoPlayer } from "@/components/professional/video-player";
import { getPublicProfile } from "@/lib/server/professionals";
import { ContactForm } from "./contact-form";
import { ReportForm } from "./report-form";
import { ReviewCta } from "./review-cta";
import { TrackView } from "./track-view";

export const generateMetadata = async ({ params }: PageProps<"/p/[slug]">): Promise<Metadata> => {
  const data = await getPublicProfile((await params).slug);
  if (!data) return { title: "Perfil · Fulltime" };
  const { pro } = data;
  return {
    title: `${pro.name} · ${pro.specialty}${pro.city ? ` em ${pro.city}` : ""} · Fulltime`,
    description: pro.bio.slice(0, 160),
    openGraph: pro.avatarUrl ? { images: [pro.avatarUrl] } : undefined,
  };
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

const Profile = async ({ params }: { params: PageProps<"/p/[slug]">["params"] }) => {
  const data = await getPublicProfile((await params).slug);
  if (!data) notFound();
  const { pro, reviews } = data;
  const place = [pro.neighborhood, pro.city].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <TrackView slug={pro.slug} />
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
            {place && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" /> {place}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> Responde em ~{pro.responseHours} h
            </span>
            {pro.rating !== null && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-brand-amber text-brand-amber" /> {pro.rating.toFixed(1)} · {pro.reviewsCount} avaliações
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
          {pro.whatsapp && (
            <a href={`/p/${pro.slug}/whatsapp`} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
              <MessageCircle /> Chamar no WhatsApp
            </a>
          )}
          <a href="#contato" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Enviar solicitação
          </a>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Sobre">
            <p className="leading-relaxed whitespace-pre-line">{pro.bio}</p>
            {pro.years > 0 && <p className="mt-3 text-sm text-muted-foreground">{pro.years} anos de experiência</p>}
          </Section>

          {pro.videos.length > 0 && (
            <Section title="Vídeos">
              <VideoPlayer video={pro.videos[0]} large />
              {pro.videos.length > 1 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {pro.videos.slice(1).map((v, i) => (
                    <VideoPlayer key={v.id} video={v} index={i + 1} />
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

          {pro.photos.length > 0 && (
            <Section title="Fotos">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pro.photos.map((f) => (
                  <figure key={f.id} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    <Image src={f.url} alt={f.caption || `Foto de ${pro.name}`} fill sizes="(min-width: 1024px) 240px, 45vw" className="object-cover" />
                    {f.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-xs text-white">{f.caption}</figcaption>}
                  </figure>
                ))}
              </div>
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

          {pro.education.length > 0 && (
            <Section title="Formação">
              <ul className="space-y-3">
                {pro.education.map((e) => (
                  <li key={`${e.title}-${e.year}`} className="flex items-start gap-3">
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
          )}

          {pro.portfolio.length > 0 && (
            <Section title="Portfólio">
              <div className="grid gap-3 sm:grid-cols-2">
                {pro.portfolio.map((i) => (
                  <div key={i.id} className="rounded-xl bg-muted p-4">
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">{i.type}</p>
                    <p className="mt-1 font-medium">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.detail}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Avaliações de famílias">
            {pro.rating !== null ? (
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
                      <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span>
                    </div>
                    <p>{r.text}</p>
                    {r.reply && <p className="ml-4 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Resposta: {r.reply}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">A nota aparece a partir de 3 avaliações.</p>
            )}
            <Suspense>
              <ReviewCta slug={pro.slug} professionalId={pro.id} />
            </Suspense>
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
              {place && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  {place}
                </li>
              )}
            </ul>
          </Section>

          <div id="contato">
            <Section title="Enviar solicitação">
              <ContactForm name={pro.name.split(" ")[0]} slug={pro.slug} />
            </Section>
          </div>

          <p className="text-xs text-muted-foreground">
            O Fulltime aproxima famílias e profissionais. Confirme valores e condições diretamente antes de contratar.
          </p>
          <ReportForm slug={pro.slug} />
        </aside>
      </div>
    </div>
  );
};

const ProfilePage = ({ params }: PageProps<"/p/[slug]">) => (
  <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">Carregando perfil…</div>}>
    <Profile params={params} />
  </Suspense>
);

export default ProfilePage;
