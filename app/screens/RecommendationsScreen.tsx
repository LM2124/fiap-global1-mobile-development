import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FC, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Causas, type Recommendation, type RecommendationPriority } from "types"

import { Button, Header, Screen, Text } from "@/components"
import { generalRecommendations, recommendationsByCause } from "@/data"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"

type RecommendationsNavigationProp = NativeStackNavigationProp<AppStackParamList, "Recommendations">

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
    // Combina recomendações específicas com gerais
    const specificRecommendations = causas.flatMap((causa) => recommendationsByCause[causa])
    const allRecommendations = [...specificRecommendations, ...generalRecommendations]

    // Remove duplicatas baseado no título
    const uniqueRecommendations = allRecommendations.filter(
      (rec, index, arr) => arr.findIndex((r) => r.title === rec.title) === index,
    )

    // Ordena por prioridade
    return uniqueRecommendations.sort((a, b) => {
      const priorityOrder: Record<RecommendationPriority, number> = {
        high: 0,
        medium: 1,
        low: 2,
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const getPriorityColor = (priority: RecommendationPriority): string => {
    switch (priority) {
      case "high":
        return "#FF3B30"
      case "medium":
        return "#FF9500"
      case "low":
        return "#007AFF"
    }
  }

  const getPriorityText = (priority: RecommendationPriority): string => {
    switch (priority) {
      case "high":
        return "Alta Prioridade"
      case "medium":
        return "Média Prioridade"
      case "low":
        return "Baixa Prioridade"
    }
  }

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    })
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header title="Recomendações" leftIcon="back" onLeftPress={() => navigation.goBack()} />

      <Text preset="heading" style={$title}>
        Recomendações de Segurança
      </Text>

      {!!eventTitle && <Text style={$eventTitle}>Baseado no evento: {eventTitle}</Text>}

      {eventCausas.length > 0 && (
        <Text style={$causasText}>Causas identificadas: {eventCausas.join(", ")}</Text>
      )}

      <Text style={$subtitle}>
        Siga estas recomendações para se preparar melhor para futuras emergências
      </Text>

      {recommendations.map((rec, index) => (
        <Text
          key={`recommendation-${index}-${rec.title}`}
          style={[$recommendationCard, { borderLeftColor: getPriorityColor(rec.priority) }]}
        >
          <Text style={$recommendationIcon}>{rec.icon}</Text>
          <Text style={$recommendationTitle}>{rec.title}</Text>
          <Text style={$recommendationDescription}>{rec.description}</Text>
          <Text style={[$recommendationPriority, { color: getPriorityColor(rec.priority) }]}>
            {getPriorityText(rec.priority)}
          </Text>
        </Text>
      ))}

      <Text style={$importantNote}>
        <Text style={$importantNoteTitle}>⚠️ Importante:</Text> Estas recomendações são baseadas nas
        causas do evento reportado. Para orientações específicas da sua região, consulte a Defesa
        Civil local.
      </Text>

      <Text style={$emergencyContacts}>
        <Text style={$emergencyContactsTitle}>📞 Contatos de Emergência:</Text>
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
  paddingHorizontal: 20,
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
  marginBottom: 20,
  padding: 16,
  paddingHorizontal: 16,
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
