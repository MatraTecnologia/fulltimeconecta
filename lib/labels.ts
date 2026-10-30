export const leadStatusLabel = { NOVO: "Novo", RESPONDIDO: "Respondido", CONVERTIDO: "Convertido", DESCARTADO: "Descartado" } as const;
export const leadChannelLabel = { FORMULARIO: "Formulário", WHATSAPP: "WhatsApp" } as const;
export const planLabel = { GRATUITO: "Gratuito", PREMIUM: "Premium", DESTAQUE: "Destaque" } as const;
export const verificationLabel = {
  RASCUNHO: "Não enviado",
  ENVIADO: "Enviado",
  EM_ANALISE: "Em análise",
  CORRECAO: "Pendente de correção",
  VERIFICADO: "Verificado",
  REJEITADO: "Rejeitado",
} as const;

export const formatDate = (d: Date) => d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
