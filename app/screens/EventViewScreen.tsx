import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FC, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Evento } from "types"

import { Button, Header, Screen, Text } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"

type EventViewNavigationProp = NativeStackNavigationProp<AppStackParamList, "EventView">

interface EventViewScreenProps extends AppStackScreenProps<"EventView"> {}

export const EventViewScreen: FC<EventViewScreenProps> = ({ route }) => {
  const navigation = useNavigation<EventViewNavigationProp>()
  const { eventId } = route.params
  const [event, setEvent] = useState<Evento | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const loadedEvent = await eventService.getEventById(eventId)
        setEvent(loadedEvent)
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvent()
  }, [eventId])

  if (isLoading) {
    return (
      <Screen style={$root} preset="scroll">
        <Header title="Carregando..." leftIcon="back" onLeftPress={() => navigation.goBack()} />
        <Text style={$loading}>Carregando evento...</Text>
      </Screen>
    )
  }

  if (!event) {
    return (
      <Screen style={$root} preset="scroll">
        <Header title="Erro" leftIcon="back" onLeftPress={() => navigation.goBack()} />
        <Text style={$error}>Evento não encontrado.</Text>
        <Button text="Voltar" onPress={() => navigation.goBack()} style={$button} />
      </Screen>
    )
  }

  const getTotalDamages = (): number => {
    return event.danos.reduce((total, dano) => total + (dano.danoMonetario ?? 0), 0)
  }

  return (
    <Screen style={$root} preset="scroll">
      <Header
        title={event.title}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        backgroundColor="#f8f9fa"
      />

      <Text preset="heading" style={$title}>
        {event.title}
      </Text>

      <Text style={$label}>Descrição:</Text>
      <Text style={$content}>{event.descricao}</Text>

      <Text style={$label}>Data e Hora:</Text>
      <Text style={$content}>{event.dataHora.toLocaleString()}</Text>

      <Text style={$label}>Causas:</Text>
      <Text style={$content}>{event.causas.join(", ")}</Text>

      <Text style={$label}>Local:</Text>
      <Text style={$content}>{event.local.descricao}</Text>

      {event.danos.length > 0 && (
        <>
          <Text style={$label}>Prejuízos Reportados ({event.danos.length}):</Text>
          {event.danos.map((dano, index) => (
            <Text key={index} style={$damageItem}>
              • {dano.descricao}
              {dano.danoMonetario && dano.danoMonetario > 0 && (
                <Text style={$damageValue}>
                  {"\n"} Valor: R$ {dano.danoMonetario.toFixed(2)}
                </Text>
              )}
              {dano.idAutor && (
                <Text style={$damageAuthor}>
                  {"\n"} Por: {dano.idAutor}
                </Text>
              )}
            </Text>
          ))}

          {getTotalDamages() > 0 && (
            <Text style={$totalDamages}>
              💰 Total em prejuízos: R$ {getTotalDamages().toFixed(2)}
            </Text>
          )}
        </>
      )}

      <Text style={$label}>Registrado por:</Text>
      <Text style={$content}>{event.autor.name}</Text>

      <Button
        text="Continuar Registro"
        onPress={() => navigation.navigate("LocationForm", { eventId: event.idEvento })}
        style={$button}
      />

      <Button
        text="Voltar ao Início"
        preset="reversed"
        onPress={() => navigation.navigate("Home")}
        style={$button}
      />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
  backgroundColor: "#f8f9fa",
}

const $loading: TextStyle = {
  textAlign: "center",
  margin: 24,
}

const $error: TextStyle = {
  textAlign: "center",
  margin: 24,
  color: "#FF3B30",
}

const $title: TextStyle = {
  marginBottom: 16,
  marginTop: 16,
  textAlign: "center",
}

const $label: TextStyle = {
  fontWeight: "600",
  marginTop: 16,
  marginBottom: 4,
  color: "#444",
}

const $content: TextStyle = {
  marginBottom: 8,
  color: "#222",
}

const $damageItem: TextStyle = {
  marginBottom: 12,
  padding: 12,
  backgroundColor: "#fff",
  borderRadius: 10,
  borderLeftWidth: 3,
  borderLeftColor: "#007AFF",
}

const $damageValue: TextStyle = {
  fontWeight: "600",
  color: "#007AFF",
}

const $damageAuthor: TextStyle = {
  fontStyle: "italic",
  color: "#666",
}

const $totalDamages: TextStyle = {
  marginTop: 8,
  marginBottom: 16,
  fontSize: 16,
  fontWeight: "600",
  color: "#007AFF",
  textAlign: "center",
  padding: 12,
  backgroundColor: "#e3f2fd",
  borderRadius: 8,
}

const $button: ViewStyle = {
  marginBottom: 12,
}
