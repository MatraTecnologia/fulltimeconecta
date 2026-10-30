import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../lib/generated/prisma/client";
import { leads, reviews } from "./seed-data/panel";
import { professionals } from "./seed-data/professionals";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const PASSWORD = "fulltime123";
const DAY = 864e5;

const reviewTexts = [
  "Profissional atenciosa, explica cada etapa e dá orientações práticas para casa.",
  "Meu filho se sentiu acolhido desde a primeira sessão. Recomendo muito.",
  "Comunicação clara com a família e com a escola. Vimos evolução em poucos meses.",
  "Ambiente tranquilo e organizado, o que ajudou bastante na adaptação.",
  "Pontual e cuidadoso. Sempre responde as mensagens rapidamente.",
  "Excelente atendimento, com metas claras e devolutivas frequentes.",
];

const createUser = async (name: string, email: string, role: string, createdAt = new Date()) => {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;
  const user = await db.user.create({ data: { name, email, role, emailVerified: true, createdAt } });
  await db.account.create({ data: { userId: user.id, accountId: user.id, providerId: "credential", password: await hashPassword(PASSWORD) } });
  return user;
};

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres) no .env");
  if (await db.user.findUnique({ where: { email } })) return;
  const user = await db.user.create({ data: { name: "Moderação Fulltime", email, role: "admin", emailVerified: true } });
  await db.account.create({ data: { userId: user.id, accountId: user.id, providerId: "credential", password: await hashPassword(password) } });
};

const main = async () => {
  await createAdmin();
  if (process.env.NODE_ENV === "production" || process.env.SEED_DEMO === "false") return;

  const reviewers = await Promise.all(
    ["Renata Dias", "Eduardo Lins", "Helena Martins", "Camila Souza", "Patrícia Gomes", "Sérgio Prado"].map((n, i) =>
      createUser(n, `familia${i + 1}@demo.fulltime.com.br`, "familia", new Date(Date.now() - 90 * DAY)),
    ),
  );

  for (const [index, p] of professionals.entries()) {
    if (await db.professional.findUnique({ where: { slug: p.slug } })) continue;
    const user = await createUser(p.name, `${p.slug}@demo.fulltime.com.br`, "profissional", new Date(Date.now() - 200 * DAY));
    const plan = p.plan.toUpperCase() as "GRATUITO" | "PREMIUM" | "DESTAQUE";
    const pro = await db.professional.create({
      data: {
        userId: user.id,
        slug: p.slug,
        name: p.name,
        specialty: p.specialty,
        councilName: p.council?.name,
        councilNumber: p.council?.number,
        councilUf: p.council?.uf,
        city: p.city,
        neighborhood: p.neighborhood,
        bio: p.bio,
        years: p.years,
        gender: p.gender,
        conditions: p.conditions,
        ageRanges: p.ageRanges,
        approaches: p.approaches,
        modalities: p.modalities,
        healthPlans: p.healthPlans,
        languages: p.languages,
        price: p.price,
        vacancy: p.vacancy.toUpperCase() as "ABERTA" | "ESPERA" | "FECHADA",
        plan,
        planUntil: plan === "GRATUITO" ? null : new Date(Date.now() + (plan === "DESTAQUE" ? 7 : 120) * DAY),
        status: "VERIFICADO",
        submittedAt: new Date(Date.now() - 190 * DAY),
        responseHours: p.responseHours,
        whatsapp: p.whatsapp,
        accent: p.accent,
        instagram: p.social.instagram,
        youtube: p.social.youtube,
        tiktok: p.social.tiktok,
        linkedin: p.social.linkedin,
        site: p.social.site,
        education: { create: p.education },
        portfolio: { create: p.portfolio },
      },
    });

    const reviewCount = Math.min(p.reviewsCount, reviewers.length);
    for (let i = 0; i < reviewCount; i++) {
      const sample = index === 0 ? reviews[i] : undefined;
      const rating = sample?.rating ?? 4 + ((i + index) % 2);
      await db.review.create({
        data: {
          professionalId: pro.id,
          authorId: reviewers[i].id,
          rating,
          acolhimento: sample?.criteria.acolhimento ?? rating,
          comunicacao: sample?.criteria.comunicacao ?? rating,
          pontualidade: sample?.criteria.pontualidade ?? Math.max(3, rating - (i % 2)),
          text: sample?.text ?? reviewTexts[(i + index) % reviewTexts.length],
          reply: sample?.reply ?? null,
          createdAt: new Date(Date.now() - (10 + i * 9) * DAY),
        },
      });
    }

    const events = Array.from({ length: 56 }, (_, d) => {
      const day = new Date(Date.now() - (55 - d) * DAY);
      const views = Math.round((12 + d * 0.5) * (plan === "GRATUITO" ? 0.4 : 1) * (0.7 + Math.random() * 0.6));
      return [
        ...Array.from({ length: views }, () => ({ professionalId: pro.id, type: "VIEW" as const, createdAt: day })),
        ...Array.from({ length: Math.round(views * 0.15) }, () => ({ professionalId: pro.id, type: "WHATSAPP" as const, createdAt: day })),
      ];
    }).flat();
    await db.event.createMany({ data: events });

    if (index === 0) {
      for (const l of leads.filter((x) => x.channel === "Formulário")) {
        const status = l.status.toUpperCase() as "NOVO" | "RESPONDIDO" | "CONVERTIDO" | "DESCARTADO";
        const createdAt = new Date(`${l.date}T12:00:00-03:00`);
        await db.lead.create({
          data: {
            professionalId: pro.id,
            guardian: l.guardian,
            contact: "(43) 99999-0000",
            personAge: l.personAge,
            condition: l.condition,
            modality: l.modality,
            message: l.message,
            channel: "FORMULARIO",
            status,
            createdAt,
          },
        });
        await db.event.create({ data: { professionalId: pro.id, type: "LEAD", createdAt } });
      }
      await db.order.create({ data: { professionalId: pro.id, item: "Destaque 7 dias", amount: 3990, method: "Simulado", status: "Pago" } });
    }
  }

  if (!(await db.professional.findUnique({ where: { slug: "larissa-mendes" } }))) {
    const user = await createUser("Larissa Mendes", "larissa-mendes@demo.fulltime.com.br", "profissional");
    await db.professional.create({
      data: {
        userId: user.id,
        slug: "larissa-mendes",
        name: "Larissa Mendes",
        specialty: "Fonoaudiólogo(a)",
        councilName: "CRFa",
        councilNumber: "3-15520",
        councilUf: "PR",
        city: "Londrina-PR",
        neighborhood: "Centro",
        bio: "Fonoaudióloga recém-cadastrada, com foco em linguagem infantil e motricidade orofacial.",
        conditions: ["Atraso de fala"],
        status: "ENVIADO",
        submittedAt: new Date(),
      },
    });
  }
};

main()
  .then(() => console.info(`Seed concluído. Contas de demonstração (@demo.fulltime.com.br) usam a senha ${PASSWORD}.`))
  .finally(() => db.$disconnect());
