import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FC, useCallback, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Evento } from "types"

import { Button, Event, Header, Screen, Text } from "@/components"
import { AppStackParamList } from "@/navigators"
import { eventService } from "@/services/eventService"

type HomeNavigationProp = NativeStackNavigationProp<AppStackParamList, "Home">

export const HomeScreen: FC = () => {
  const navigation = useNavigation<HomeNavigationProp>()
  const [events, setEvents] = useState<Evento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadEvents = async () => {
    try {
      const loadedEvents = await eventService.getAllEvents()
      setEvents(loadedEvents)
    } catch (error) {
      console.error("Erro ao carregar eventos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Recarrega eventos quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadEvents()
    }, []),
  )

  useEffect(() => {
    loadEvents()
  }, [])

  const handleNewEvent = () => {
    navigation.navigate("EventCreate")
  }

  return (
    <Screen style={$root} preset="scroll">
      <Header title="Panorama Geral" backgroundColor="#f8f9fa" />

      <Text style={$welcomeText}>
        Bem-vindo ao sistema de registro de eventos de falta de energia!
        {"\n"}Aqui você pode visualizar e registrar novos eventos.
      </Text>

      <Button text="+ Registrar Novo Evento" style={$newEventButton} onPress={handleNewEvent} />

      {events.length === 0 && !isLoading ? (
        <Text style={$emptyStateText}>
          Nenhum evento registrado ainda.{"\n"}
          Toque no botão acima para registrar seu primeiro evento!
        </Text>
      ) : (
        <>
          <Text style={$sectionTitle}>Eventos Registrados ({events.length})</Text>

          {events.map((event) => (
            <Event key={event.idEvento} event={event} />
          ))}
        </>
      )}
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
  backgroundColor: "#f8f9fa",
}

const $welcomeText: TextStyle = {
  marginVertical: 16,
  marginHorizontal: 0,
  marginBottom: 24,
  textAlign: "center",
  lineHeight: 22,
  fontSize: 18,
  color: "#222",
}

const $newEventButton: ViewStyle = {
  marginBottom: 24,
  borderRadius: 10,
}

const $emptyStateText: TextStyle = {
  marginVertical: 16,
  textAlign: "center",
  color: "#666",
  fontStyle: "italic",
  fontSize: 16,
}

const $sectionTitle: TextStyle = {
  marginBottom: 16,
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
}
