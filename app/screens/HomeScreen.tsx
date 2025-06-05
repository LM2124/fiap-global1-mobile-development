import { FC, useEffect, useState, useCallback } from "react"
import { ViewStyle, TextStyle } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Header, Screen, Button, Text, Event } from "@/components"
import { AppStackParamList } from "@/navigators"
import { eventService } from "@/services/eventService"
import { Evento } from "types"

type HomeNavigationProp = NativeStackNavigationProp<AppStackParamList, "Home">

// Tela 1 - Panorama Geral: Exibição de um resumo dos eventos registrados pelo usuário sobre falta de energia

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
    }, [])
  )

  useEffect(() => {
    loadEvents()
  }, [])

  const handleNewEvent = () => {
    navigation.navigate("EventCreate")
  }

  return (
    <Screen style={$root} preset="scroll">
      <Header title="Panorama Geral" />
      
      <Text style={$welcomeText}>
        Bem-vindo ao sistema de registro de eventos de falta de energia! 
        {"\n"}Aqui você pode visualizar e registrar novos eventos.
      </Text>

      <Button
        text="+ Registrar Novo Evento"
        style={$newEventButton}
        onPress={handleNewEvent}
      />

      {events.length === 0 && !isLoading ? (
        <Text style={$emptyStateText}>
          Nenhum evento registrado ainda.{"\n"}
          Toque no botão acima para registrar seu primeiro evento!
        </Text>
      ) : (
        <>
          <Text style={$sectionTitle}>
            Eventos Registrados ({events.length})
          </Text>
          
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
}

const $welcomeText: TextStyle = {
  margin: 16,
  marginBottom: 24,
  textAlign: "center",
  lineHeight: 22,
}

const $newEventButton: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 24,
}

const $emptyStateText: TextStyle = {
  margin: 16,
  textAlign: "center",
  color: "#666",
  fontStyle: "italic",
}

const $sectionTitle: TextStyle = {
  marginHorizontal: 16,
  marginBottom: 16,
  fontSize: 18,
  fontWeight: "600",
}
