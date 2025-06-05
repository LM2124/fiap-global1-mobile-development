import { FC, useState, useEffect } from "react"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button, Header, Screen, Text, TextField } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"
import { Local } from "types"

type LocationFormNavigationProp = NativeStackNavigationProp<AppStackParamList, "LocationForm">

interface LocationFormScreenProps extends AppStackScreenProps<"LocationForm"> {}

export const LocationFormScreen: FC<LocationFormScreenProps> = ({ route }) => {
  const navigation = useNavigation<LocationFormNavigationProp>()
  const { eventId } = route.params || {}
  const actualEventId = eventId ?? 1 // Default para teste se não houver eventId

  const [descricao, setDescricao] = useState("")
  const [coordenadas, setCoordenadas] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [hasExistingLocation, setHasExistingLocation] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await eventService.getEventById(actualEventId)
        if (event) {
          setEventTitle(event.title)
          if (event.local?.descricao && event.local.descricao !== "Localização a ser definida") {
            setDescricao(event.local.descricao)
            setHasExistingLocation(true)
            if (event.local.coordenadas && event.local.coordenadas.length === 2) {
              setCoordenadas(`${event.local.coordenadas[0] ?? 0}, ${event.local.coordenadas[1] ?? 0}`)
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      }
    }
    loadEvent()
  }, [actualEventId])

  const parseCoordinates = (coordStr: string): [number, number] | undefined => {
    if (!coordStr.trim()) return undefined
    
    const coords = coordStr.split(",").map(c => parseFloat(c.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return [coords[0], coords[1]]
    }
    return undefined
  }

  const handleSaveLocation = async () => {
    if (!descricao.trim()) {
      Alert.alert("Erro", "Por favor, informe a descrição da localização")
      return
    }

    setIsLoading(true)

    try {
      const local: Local = {
        descricao: descricao.trim(),
        coordenadas: parseCoordinates(coordenadas)
      }

      const success = await eventService.addLocationToEvent(actualEventId, local)
      
      if (success) {
        // Avança automaticamente para a próxima tela sem mostrar alert
        navigation.navigate("InterruptionTimeForm", { eventId: actualEventId })
      } else {
        Alert.alert("Erro", "Não foi possível salvar a localização. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao salvar localização:", error)
      Alert.alert("Erro", "Não foi possível salvar a localização. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header 
        title="Localização" 
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      
      <Text preset="heading" style={$title}>
        Localização Atingida
      </Text>
      
      {!!eventTitle && (
        <Text style={$eventTitle}>
          Evento: {eventTitle}
        </Text>
      )}
      
      <Text style={$subtitle}>
        Informe onde ocorreu o evento de falta de energia
      </Text>

      <TextField
        label="Descrição da Localização *"
        placeholder="Ex: Avenida Paulista, próximo ao metrô Trianon"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
        containerStyle={$field}
        helper="Descreva de forma clara onde ocorreu o evento"
      />

      <TextField
        label="Coordenadas (Opcional)"
        placeholder="Ex: -23.5505, -46.6333"
        value={coordenadas}
        onChangeText={setCoordenadas}
        containerStyle={$field}
        helper="Formato: latitude, longitude (separados por vírgula)"
      />

      <Text style={$infoText}>
        💡 As coordenadas podem ser obtidas através de aplicativos de mapa como Google Maps ou GPS.
      </Text>

      {hasExistingLocation ? (
        <>
          <Text style={$existingDataText}>
            ✅ Localização já foi definida. Você pode editá-la ou prosseguir para a próxima etapa.
          </Text>
          <Button
            text={isLoading ? "Salvando..." : "Atualizar Localização"}
            style={$saveButton}
            disabled={isLoading}
            onPress={handleSaveLocation}
          />
          <Button
            text="Continuar para Tempo de Interrupção"
            style={$continueButton}
            onPress={() => navigation.navigate("InterruptionTimeForm", { eventId: actualEventId })}
          />
        </>
      ) : (
        <>
          <Button
            text={isLoading ? "Salvando..." : "Salvar Localização"}
            style={$saveButton}
            disabled={isLoading}
            onPress={handleSaveLocation}
          />
          <Button
            text="Pular esta etapa"
            preset="reversed"
            style={$skipButton}
            onPress={() => navigation.navigate("InterruptionTimeForm", { eventId: actualEventId })}
          />
        </>
      )}
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
  marginBottom: 16,
  fontWeight: "600",
}

const $subtitle: ViewStyle = {
  marginBottom: 24,
}

const $field: ViewStyle = {
  marginBottom: 16,
}

const $infoText: TextStyle = {
  marginBottom: 24,
  marginTop: 8,
  fontSize: 14,
  lineHeight: 20,
}

const $saveButton: ViewStyle = {
  marginTop: 16,
  marginBottom: 12,
}

const $skipButton: ViewStyle = {
  marginBottom: 16,
}

const $existingDataText: TextStyle = {
  marginTop: 16,
  marginBottom: 16,
  fontSize: 14,
  color: "#4CAF50",
  textAlign: "center",
  fontWeight: "500",
}

const $continueButton: ViewStyle = {
  marginBottom: 16,
}
