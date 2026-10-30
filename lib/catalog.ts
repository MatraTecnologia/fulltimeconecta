export const specialties = [
  "Psicólogo(a)",
  "Fonoaudiólogo(a)",
  "Terapeuta Ocupacional",
  "Neuropediatra",
  "Psiquiatra infantil",
  "Neuropsicólogo(a)",
  "Psicopedagogo(a)",
  "Fisioterapeuta",
  "Nutricionista",
  "Acompanhante Terapêutico",
  "Musicoterapeuta",
  "Mediador(a) escolar",
] as const;

export const conditions = [
  "TEA",
  "TDAH",
  "Dislexia",
  "Discalculia",
  "TOD",
  "Altas habilidades",
  "Atraso de fala",
  "TPAC",
  "Síndrome de Down",
  "Apraxia de fala",
] as const;

export const approaches = [
  "ABA",
  "Denver (ESDM)",
  "TEACCH",
  "PECS",
  "Integração Sensorial",
  "DIR/Floortime",
  "TCC",
  "PROMPT",
  "Bobath",
] as const;

export const modalities = ["Presencial", "Online", "Domiciliar", "Escolar"] as const;

export const ageRanges = ["0–3 anos", "4–12 anos", "13–17 anos", "Adultos"] as const;

export const healthPlans = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Particular"] as const;

export const cities = [
  "Londrina-PR",
  "Maringá-PR",
  "Curitiba-PR",
  "São Paulo-SP",
  "Campinas-SP",
  "Belo Horizonte-MG",
] as const;

export const plans = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: "R$ 0",
    period: "sem vencimento",
    highlight: false,
    features: [
      "Perfil público verificado",
      "1 foto e 1 especialidade",
      "Até 3 condições atendidas",
      "1 local de atendimento",
      "Botão de WhatsApp",
      "Estatística resumida",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 59,90",
    period: "30 dias",
    altPrice: "ou R$ 499/ano (economize 30%)",
    highlight: true,
    features: [
      "Tudo do Gratuito",
      "Prioridade sobre perfis gratuitos",
      "Selo Premium e card diferenciado",
      "12 fotos, vídeo e portfólio completo",
      "3 especialidades e condições ilimitadas",
      "Até 3 locais de atendimento",
      "Estatísticas diárias",
    ],
  },
  {
    id: "destaque",
    name: "Destaque",
    price: "R$ 39,90",
    period: "7 dias · avulso",
    highlight: false,
    features: [
      "Topo da busca na sua cidade e especialidade",
      "Card destacado",
      "Soma a qualquer plano",
      "Pode ser comprado várias vezes",
    ],
  },
] as const;
