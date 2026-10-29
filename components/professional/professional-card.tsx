import Link from "next/link";
import { MapPin, MessageCircle, PlayCircle, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Professional } from "@/lib/mock/professionals";
import { Chip, PlanBadge, ProAvatar, VacancyBadge, VerifiedBadge } from "./pro-badges";

export const whatsappUrl = (pro: Professional) =>
  `https://wa.me/${pro.whatsapp}?text=${encodeURIComponent(`Olá, ${pro.name.split(" ")[0]}! Vi seu perfil no NeuroConecta e gostaria de mais informações.`)}`;

export const ProfessionalCard = ({ pro }: { pro: Professional }) => (
  <article
    className={cn(
      "flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md sm:flex-row",
      pro.plan === "destaque" && "border-brand-amber/60 ring-2 ring-brand-amber/30",
      pro.plan === "premium" && "border-brand-lilac/40",
    )}
  >
    <ProAvatar pro={pro} />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/p/${pro.slug}`} className="font-heading text-lg font-bold hover:underline">
          {pro.name}
        </Link>
        <PlanBadge plan={pro.plan} />
      </div>
      <p className="text-sm text-muted-foreground">
        {pro.specialty} · {pro.years} anos de experiência
      </p>
      <VerifiedBadge pro={pro} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-4" /> {pro.neighborhood}, {pro.city} · {pro.distanceKm < 50 ? `${pro.distanceKm} km` : "outra cidade"}
        </span>
        {pro.rating && pro.reviewsCount >= 3 && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-4 fill-brand-amber text-brand-amber" /> {pro.rating.toFixed(1)} ({pro.reviewsCount})
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pro.conditions.slice(0, 3).map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
        {pro.modalities.map((m) => (
          <Chip key={m} className="bg-secondary">
            {m}
          </Chip>
        ))}
        {pro.videos.length > 0 && (
          <Chip className="inline-flex items-center gap-1 border-brand-coral/40 text-brand-coral">
            <PlayCircle className="size-3.5" /> {pro.videos.length} {pro.videos.length > 1 ? "vídeos" : "vídeo"}
          </Chip>
        )}
      </div>
    </div>
    <div className="flex shrink-0 flex-row items-end justify-between gap-2 sm:flex-col">
      <VacancyBadge vacancy={pro.vacancy} />
      <div className="flex gap-2">
        <Link href={`/p/${pro.slug}`} className={buttonVariants({ variant: "outline" })}>
          Ver perfil
        </Link>
        <a href={whatsappUrl(pro)} target="_blank" rel="noreferrer" className={buttonVariants()}>
          <MessageCircle /> WhatsApp
        </a>
      </div>
    </div>
  </article>
);
