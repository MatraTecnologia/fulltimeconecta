export type LeadStatus = "novo" | "respondido" | "convertido" | "descartado";

export const leads: {
  id: string;
  guardian: string;
  channel: "WhatsApp" | "Formulário";
  personAge: string;
  condition: string | null;
  modality: string;
  message: string;
  date: string;
  status: LeadStatus;
}[] = [
  { id: "l1", guardian: "Camila Souza", channel: "Formulário", personAge: "3 anos", condition: "TEA", modality: "Presencial", message: "Meu filho ainda não fala e a pediatra indicou fono. Vocês têm horário à tarde?", date: "2026-10-29", status: "novo" },
  { id: "l2", guardian: "Marcos Pereira", channel: "WhatsApp", personAge: "5 anos", condition: null, modality: "Presencial", message: "Clique no WhatsApp", date: "2026-10-28", status: "novo" },
  { id: "l3", guardian: "Patrícia Gomes", channel: "Formulário", personAge: "7 anos", condition: "Apraxia de fala", modality: "Escolar", message: "Gostaria de saber se atende na escola Marista.", date: "2026-10-27", status: "respondido" },
  { id: "l4", guardian: "Eduardo Lins", channel: "WhatsApp", personAge: "4 anos", condition: "TEA", modality: "Presencial", message: "Clique no WhatsApp", date: "2026-10-25", status: "convertido" },
  { id: "l5", guardian: "Renata Dias", channel: "Formulário", personAge: "2 anos", condition: "Atraso de fala", modality: "Presencial", message: "Aceita Unimed?", date: "2026-10-22", status: "convertido" },
  { id: "l6", guardian: "Sérgio Prado", channel: "Formulário", personAge: "9 anos", condition: null, modality: "Online", message: "Atende online?", date: "2026-10-20", status: "descartado" },
];

export const reviews = [
  { id: "r1", author: "Renata D.", date: "2026-10-12", rating: 5, criteria: { acolhimento: 5, comunicacao: 5, pontualidade: 5 }, text: "A Ana explica tudo para a gente depois de cada sessão e manda atividades para casa. Em três meses meu filho começou a usar as figuras para pedir as coisas.", reply: "Obrigada, Renata! O mérito é da dedicação de vocês em casa." },
  { id: "r2", author: "Eduardo L.", date: "2026-09-30", rating: 5, criteria: { acolhimento: 5, comunicacao: 4, pontualidade: 5 }, text: "Consultório tranquilo, sem muito barulho, o que fez toda a diferença para o nosso filho.", reply: null },
  { id: "r3", author: "Helena M.", date: "2026-09-02", rating: 4, criteria: { acolhimento: 5, comunicacao: 4, pontualidade: 3 }, text: "Profissional excelente. Às vezes atrasa uns minutos, mas compensa no atendimento.", reply: null },
];

export const weeklyStats = [
  { week: "Set 08", views: 142, clicks: 18, leads: 4 },
  { week: "Set 15", views: 168, clicks: 22, leads: 5 },
  { week: "Set 22", views: 155, clicks: 19, leads: 3 },
  { week: "Set 29", views: 201, clicks: 31, leads: 7 },
  { week: "Out 06", views: 236, clicks: 35, leads: 8 },
  { week: "Out 13", views: 224, clicks: 29, leads: 6 },
  { week: "Out 20", views: 318, clicks: 47, leads: 11 },
  { week: "Out 27", views: 341, clicks: 52, leads: 12 },
];

export const searchTerms = [
  { term: "fonoaudiólogo londrina tea", count: 214 },
  { term: "fono atraso de fala", count: 132 },
  { term: "pecs londrina", count: 61 },
  { term: "fono unimed londrina", count: 48 },
  { term: "fono escolar", count: 22 },
];

export const orders = [
  { id: "#NC-1042", item: "Destaque 7 dias", date: "2026-10-24", amount: "R$ 39,90", method: "Pix", status: "Pago" },
  { id: "#NC-0987", item: "Premium anual", date: "2026-03-02", amount: "R$ 499,00", method: "Cartão 12x", status: "Pago" },
  { id: "#NC-0512", item: "Premium mensal", date: "2026-01-30", amount: "R$ 59,90", method: "Boleto", status: "Pago" },
];

export const verificationQueue = [
  { id: "v1", name: "Larissa Mendes", specialty: "Fonoaudiólogo(a)", council: "CRFa 3-15520/PR", sent: "2026-10-28", status: "em análise", docs: 3 },
  { id: "v2", name: "Pedro Henrique Costa", specialty: "Psicólogo(a)", council: "CRP 08/30112", sent: "2026-10-28", status: "enviado", docs: 2 },
  { id: "v3", name: "Aline Barbosa", specialty: "Acompanhante Terapêutico", council: "Sem conselho · certificado", sent: "2026-10-27", status: "enviado", docs: 1 },
  { id: "v4", name: "Rodrigo Teixeira", specialty: "Terapeuta Ocupacional", council: "CREFITO 8/14001-TO", sent: "2026-10-26", status: "pendente de correção", docs: 2 },
];

export const reports = [
  { id: "d1", target: "Perfil · Clínica Sol Nascente", reason: "Promessa de cura", count: 3, date: "2026-10-27", status: "aberta" },
  { id: "d2", target: "Avaliação em Rafael Moura", reason: "Conteúdo impróprio", count: 1, date: "2026-10-25", status: "aberta" },
  { id: "d3", target: "Perfil · João Vitor A.", reason: "Registro falso", count: 1, date: "2026-10-21", status: "oculto preventivo" },
];
