import type { Causas, Recommendation } from "types"

// Recomendações gerais que sempre aparecem
export const generalRecommendations: Recommendation[] = [
  {
    title: "Contatos de Emergência",
    description:
      "Tenha sempre à mão os números da concessionária de energia, bombeiros e defesa civil.",
    icon: "📞",
    priority: "high",
  },
  {
    title: "Primeiros Socorros",
    description: "Mantenha um kit de primeiros socorros completo e saiba como usá-lo.",
    icon: "🏥",
    priority: "medium",
  },
  {
    title: "Seguro Residencial",
    description: "Verifique se seu seguro cobre danos causados por falta de energia prolongada.",
    icon: "🛡️",
    priority: "low",
  },
]

export const recommendationsByCause: Record<Causas, Recommendation[]> = {
  Chuva: [
    {
      title: "Kit de Emergência",
      description: "Mantenha lanternas, velas, fósforos e pilhas sempre disponíveis em casa.",
      icon: "🔦",
      priority: "high",
    },
    {
      title: "Proteção de Equipamentos",
      description:
        "Use filtros de linha com protetor contra surtos para proteger aparelhos eletrônicos.",
      icon: "⚡",
      priority: "high",
    },
    {
      title: "Alimentos e Água",
      description: "Tenha água potável e alimentos não perecíveis para pelo menos 3 dias.",
      icon: "🥫",
      priority: "medium",
    },
  ],
  Vento: [
    {
      title: "Verificação da Rede Elétrica",
      description: "Reporte fios caídos ou postes danificados imediatamente à concessionária.",
      icon: "⚠️",
      priority: "high",
    },
    {
      title: "Segurança Doméstica",
      description:
        "Verifique telhados, antenas e estruturas que podem ser afetadas por ventos fortes.",
      icon: "🏠",
      priority: "medium",
    },
  ],
  Deslizamento: [
    {
      title: "Evacuação de Emergência",
      description: "Tenha um plano de evacuação e rotas alternativas mapeadas.",
      icon: "🚨",
      priority: "high",
    },
    {
      title: "Comunicação",
      description: "Mantenha um rádio a pilha para receber informações de emergência.",
      icon: "📻",
      priority: "high",
    },
  ],
  Árvores: [
    {
      title: "Poda Preventiva",
      description:
        "Solicite poda de árvores próximas à rede elétrica junto aos órgãos competentes.",
      icon: "🌳",
      priority: "medium",
    },
    {
      title: "Monitoramento",
      description:
        "Observe árvores com sinais de doença ou instabilidade próximas à sua residência.",
      icon: "👀",
      priority: "medium",
    },
  ],
  Infraestrutura: [
    {
      title: "Gerador de Emergência",
      description:
        "Considere investir em um gerador para equipamentos essenciais (geladeira, freezer).",
      icon: "🔋",
      priority: "medium",
    },
    {
      title: "Backup de Dados",
      description: "Faça backup regular de documentos importantes e dados digitais.",
      icon: "💾",
      priority: "low",
    },
  ],
  Outro: [
    {
      title: "Preparo Geral",
      description: "Mantenha-se informado sobre planos de contingência da sua região.",
      icon: "📋",
      priority: "medium",
    },
  ],
  Desconhecido: [
    {
      title: "Preparo Geral",
      description: "Como a causa é desconhecida, prepare-se para diversos cenários.",
      icon: "❓",
      priority: "medium",
    },
  ],
}
