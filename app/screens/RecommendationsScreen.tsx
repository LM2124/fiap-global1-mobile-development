import { FC, useState, useEffect } from "react"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button, Header, Screen, Text } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"
import { Causas } from "types"

type Priority = "high" | "medium" | "low"
type RecommendationsNavigationProp = NativeStackNavigationProp<AppStackParamList, "Recommendations">

interface Recommendation {
  title: string
  description: string
  icon: string
  priority: Priority
}

interface RecommendationsScreenProps extends AppStackScreenProps<"Recommendations"> {}

export const RecommendationsScreen: FC<RecommendationsScreenProps> = ({ route }) => {
  const navigation = useNavigation<RecommendationsNavigationProp>()
  const { eventId } = route.params
  const actualEventId = eventId // Este é obrigatório na navegação

  const [eventTitle, setEventTitle] = useState("")
  const [eventCausas, setEventCausas] = useState<Causas[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    const loadEventAndGenerateRecommendations = async () => {
      try {
        const event = await eventService.getEventById(actualEventId)
        if (event) {
          setEventTitle(event.title)
          setEventCausas(event.causas)
          
          // Gera recomendações baseadas nas causas do evento
          const generatedRecommendations = generateRecommendations(event.causas)
          setRecommendations(generatedRecommendations)
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      }
    }
    loadEventAndGenerateRecommendations()
  }, [actualEventId])

  const generateRecommendations = (causas: Causas[]): Recommendation[] => {
    const allRecommendations: Record<Causas, Recommendation[]> = {
      "Chuva": [
        {
          title: "Kit de Emergência",
          description: "Mantenha lanternas, velas, fósforos e pilhas sempre disponíveis em casa.",
          icon: "🔦",
          priority: "high"
        },
        {
          title: "Proteção de Equipamentos",
          description: "Use filtros de linha com protetor contra surtos para proteger aparelhos eletrônicos.",
          icon: "⚡",
          priority: "high"
        },
        {
          title: "Alimentos e Água",
          description: "Tenha água potável e alimentos não perecíveis para pelo menos 3 dias.",
          icon: "🥫",
          priority: "medium"
        }
      ],
      "Vento": [
        {
          title: "Verificação da Rede Elétrica",
          description: "Reporte fios caídos ou postes danificados imediatamente à concessionária.",
          icon: "⚠️",
          priority: "high"
        },
        {
          title: "Segurança Doméstica",
          description: "Verifique telhados, antenas e estruturas que podem ser afetadas por ventos fortes.",
          icon: "🏠",
          priority: "medium"
        }
      ],
      "Deslizamento": [
        {
          title: "Evacuação de Emergência",
          description: "Tenha um plano de evacuação e rotas alternativas mapeadas.",
          icon: "🚨",
          priority: "high"
        },
        {
          title: "Comunicação",
          description: "Mantenha um rádio a pilha para receber informações de emergência.",
          icon: "📻",
          priority: "high"
        }
      ],
      "Árvores": [
        {
          title: "Poda Preventiva",
          description: "Solicite poda de árvores próximas à rede elétrica junto aos órgãos competentes.",
          icon: "🌳",
          priority: "medium"
        },
        {
          title: "Monitoramento",
          description: "Observe árvores com sinais de doença ou instabilidade próximas à sua residência.",
          icon: "👀",
          priority: "medium"
        }
      ],
      "Infraestrutura": [
        {
          title: "Gerador de Emergência",
          description: "Considere investir em um gerador para equipamentos essenciais (geladeira, freezer).",
          icon: "🔋",
          priority: "medium"
        },
        {
          title: "Backup de Dados",
          description: "Faça backup regular de documentos importantes e dados digitais.",
          icon: "💾",
          priority: "low"
        }
      ],
      "Outro": [
        {
          title: "Preparo Geral",
          description: "Mantenha-se informado sobre planos de contingência da sua região.",
          icon: "📋",
          priority: "medium"
        }
      ],
      "Desconhecido": [
        {
          title: "Preparo Geral",
          description: "Como a causa é desconhecida, prepare-se para diversos cenários.",
          icon: "❓",
          priority: "medium"
        }
      ]
    }

    // Recomendações gerais que sempre aparecem
    const generalRecommendations: Recommendation[] = [
      {
        title: "Contatos de Emergência",
        description: "Tenha sempre à mão os números da concessionária de energia, bombeiros e defesa civil.",
        icon: "📞",
        priority: "high"
      },
      {
        title: "Primeiros Socorros",
        description: "Mantenha um kit de primeiros socorros completo e saiba como usá-lo.",
        icon: "🏥",
        priority: "medium"
      },
      {
        title: "Seguro Residencial",
        description: "Verifique se seu seguro cobre danos causados por falta de energia prolongada.",
        icon: "🛡️",
        priority: "low"
      }
    ]

    // Combina recomendações específicas com gerais
    const specificRecommendations = causas.flatMap(causa => allRecommendations[causa] || [])
    const combinedRecommendations = [...specificRecommendations, ...generalRecommendations]

    // Remove duplicatas baseado no título
    const uniqueRecommendations = combinedRecommendations.filter(
      (rec, index, arr) => arr.findIndex(r => r.title === rec.title) === index
    )

    // Ordena por prioridade
    return uniqueRecommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const getPriorityColor = (priority: "high" | "medium" | "low"): string => {
    switch (priority) {
      case "high": return "#FF3B30"
      case "medium": return "#FF9500"
      case "low": return "#007AFF"
    }
  }

  const getPriorityText = (priority: "high" | "medium" | "low"): string => {
    switch (priority) {
      case "high": return "Alta Prioridade"
      case "medium": return "Média Prioridade"
      case "low": return "Baixa Prioridade"
    }
  }

  const handleBackToHome = () => {
    Alert.alert(
      "Registro Concluído",
      "Obrigado por registrar este evento! Suas informações ajudam a melhorar a preparação da comunidade para futuras emergências.",
      [
        {
          text: "Voltar ao Início",
          onPress: () => navigation.navigate("Home")
        }
      ]
    )
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header 
        title="Recomendações" 
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      
      <Text preset="heading" style={$title}>
        Recomendações de Segurança
      </Text>
      
      {!!eventTitle && (
        <Text style={$eventTitle}>
          Baseado no evento: {eventTitle}
        </Text>
      )}

      {eventCausas.length > 0 && (
        <Text style={$causasText}>
          Causas identificadas: {eventCausas.join(", ")}
        </Text>
      )}
      
      <Text style={$subtitle}>
        Siga estas recomendações para se preparar melhor para futuras emergências
      </Text>

      {recommendations.map((rec, index) => (
        <Text key={`recommendation-${index}-${rec.title}`} style={[
          $recommendationCard,
          { borderLeftColor: getPriorityColor(rec.priority) }
        ]}>
          <Text style={$recommendationIcon}>{rec.icon}</Text>
          <Text style={$recommendationTitle}>{rec.title}</Text>
          <Text style={$recommendationDescription}>{rec.description}</Text>
          <Text style={[
            $recommendationPriority,
            { color: getPriorityColor(rec.priority) }
          ]}>
            {getPriorityText(rec.priority)}
          </Text>
        </Text>
      ))}

      <Text style={$importantNote}>
        ⚠️ <Text style={$importantNoteTitle}>Importante:</Text> Estas recomendações são baseadas nas causas do evento reportado. Para orientações específicas da sua região, consulte a Defesa Civil local.
      </Text>

      <Text style={$emergencyContacts}>
        📞 <Text style={$emergencyContactsTitle}>Contatos de Emergência:</Text>
        {"\n"}• Bombeiros: 193
        {"\n"}• Defesa Civil: 199
        {"\n"}• Polícia: 190
        {"\n"}• SAMU: 192
      </Text>

      <Button
        text="Finalizar e Voltar ao Início"
        style={$finishButton}
        onPress={handleBackToHome}
      />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $title: ViewStyle = {
  marginBottom: 8,
  marginTop: 16,
}

const $eventTitle: TextStyle = {
  marginBottom: 8,
  fontWeight: "600",
}

const $causasText: TextStyle = {
  marginBottom: 16,
  fontStyle: "italic",
  color: "#666",
}

const $subtitle: TextStyle = {
  marginBottom: 24,
}

const $recommendationCard: ViewStyle = {
  marginBottom: 16,
  padding: 16,
  backgroundColor: "#f8f9fa",
  borderRadius: 12,
  borderLeftWidth: 4,
}

const $recommendationIcon: TextStyle = {
  fontSize: 24,
  marginBottom: 8,
}

const $recommendationTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 8,
}

const $recommendationDescription: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  marginBottom: 8,
  color: "#333",
}

const $recommendationPriority: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  textTransform: "uppercase",
}

const $importantNote: ViewStyle = {
  marginTop: 16,
  marginBottom: 16,
  padding: 16,
  backgroundColor: "#fff3cd",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ffeaa7",
}

const $importantNoteTitle: TextStyle = {
  fontWeight: "600",
}

const $emergencyContacts: ViewStyle = {
  marginBottom: 24,
  padding: 16,
  backgroundColor: "#d1ecf1",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#bee5eb",
}

const $emergencyContactsTitle: TextStyle = {
  fontWeight: "600",
}

const $finishButton: ViewStyle = {
  marginBottom: 16,
}
