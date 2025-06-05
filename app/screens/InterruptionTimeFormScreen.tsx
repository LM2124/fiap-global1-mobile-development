import { FC, useState, useEffect } from "react"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button, Header, Screen, Text, TextField } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"

type InterruptionTimeFormNavigationProp = NativeStackNavigationProp<AppStackParamList, "InterruptionTimeForm">

interface InterruptionTimeFormScreenProps extends AppStackScreenProps<"InterruptionTimeForm"> {}

export const InterruptionTimeFormScreen: FC<InterruptionTimeFormScreenProps> = ({ route }) => {
  const navigation = useNavigation<InterruptionTimeFormNavigationProp>()
  const { eventId } = route.params || {}
  const actualEventId = eventId ?? 1 // Default para teste se não houver eventId

  const [dataInicio, setDataInicio] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [duracaoEstimada, setDuracaoEstimada] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [hasExistingTimeInfo, setHasExistingTimeInfo] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await eventService.getEventById(actualEventId)
        if (event) {
          setEventTitle(event.title)
          
          // Verifica se já existem informações de tempo na descrição
          if (event.descricao.includes("--- INFORMAÇÕES DE TEMPO ---")) {
            setHasExistingTimeInfo(true)
          }
          
          // Pré-preencher com data atual se não houver dados
          const now = new Date()
          const today = now.toISOString().split('T')[0]
          const currentTime = now.toTimeString().slice(0, 5)
          
          if (!dataInicio) setDataInicio(today)
          if (!horaInicio) setHoraInicio(currentTime)
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      }
    }
    loadEvent()
  }, [actualEventId])

  const calculateDuration = () => {
    if (dataInicio && horaInicio && dataFim && horaFim) {
      try {
        const inicio = new Date(`${dataInicio}T${horaInicio}:00`)
        const fim = new Date(`${dataFim}T${horaFim}:00`)
        
        if (fim > inicio) {
          const diffMs = fim.getTime() - inicio.getTime()
          const diffHours = diffMs / (1000 * 60 * 60)
          const hours = Math.floor(diffHours)
          const minutes = Math.round((diffHours - hours) * 60)
          
          if (hours > 0) {
            const minutesText = minutes > 0 ? ` ${minutes}min` : ''
            setDuracaoEstimada(`${hours}h${minutesText}`)
          } else {
            setDuracaoEstimada(`${minutes}min`)
          }
        }
      } catch (error) {
        console.error("Erro de cálculo de duração:", error)
      }
    }
  }

  useEffect(() => {
    calculateDuration()
  }, [dataInicio, horaInicio, dataFim, horaFim])

  const validateDates = (): boolean => {
    if (!dataInicio || !horaInicio) {
      Alert.alert("Erro", "Por favor, informe a data e hora de início da interrupção")
      return false
    }

    if (dataFim && horaFim) {
      const inicio = new Date(`${dataInicio}T${horaInicio}:00`)
      const fim = new Date(`${dataFim}T${horaFim}:00`)
      
      if (fim <= inicio) {
        Alert.alert("Erro", "A data/hora de fim deve ser posterior à data/hora de início")
        return false
      }
    }

    return true
  }

  const handleSaveTime = async () => {
    if (!validateDates()) return

    setIsLoading(true)

    try {
      // Como não temos campo específico para tempo no tipo Evento,
      // vamos adicionar como uma observação na descrição

      const event = await eventService.getEventById(actualEventId)
      if (!event) {
        Alert.alert("Erro", "Evento não encontrado")
        return
      }

      // Adiciona informações de tempo à descrição do evento
      const timeDescription = `\n\n--- INFORMAÇÕES DE TEMPO ---\nInício: ${dataInicio} às ${horaInicio}${
        dataFim && horaFim ? `\nFim: ${dataFim} às ${horaFim}` : ''
      }${duracaoEstimada ? `\nDuração: ${duracaoEstimada}` : ''}${
        observacoes ? `\nObservações: ${observacoes}` : ''
      }`

      const updatedDescription = event.descricao + timeDescription

      const success = await eventService.updateEvent(actualEventId, { 
        descricao: updatedDescription 
      })

      if (success) {
        // Avança automaticamente para a próxima tela
        navigation.navigate("DamagesForm", { eventId: actualEventId })
      } else {
        Alert.alert("Erro", "Não foi possível salvar as informações. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao salvar informações de tempo:", error)
      Alert.alert("Erro", "Não foi possível salvar as informações. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header 
        title="Tempo de Interrupção" 
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      
      <Text preset="heading" style={$title}>
        Tempo de Interrupção
      </Text>
      
      {!!eventTitle && (
        <Text style={$eventTitle}>
          Evento: {eventTitle}
        </Text>
      )}
      
      <Text style={$subtitle}>
        Registre quando ocorreu a interrupção de energia
      </Text>

      <Text preset="subheading" style={$sectionTitle}>
        Início da Interrupção *
      </Text>

      <TextField
        label="Data de Início"
        placeholder="AAAA-MM-DD"
        value={dataInicio}
        onChangeText={setDataInicio}
        containerStyle={$field}
        helper="Formato: 2024-01-15"
      />

      <TextField
        label="Hora de Início"
        placeholder="HH:MM"
        value={horaInicio}
        onChangeText={setHoraInicio}
        containerStyle={$field}
        helper="Formato: 14:30"
      />

      <Text preset="subheading" style={$sectionTitle}>
        Fim da Interrupção (Opcional)
      </Text>

      <TextField
        label="Data de Fim"
        placeholder="AAAA-MM-DD"
        value={dataFim}
        onChangeText={setDataFim}
        containerStyle={$field}
        helper="Deixe em branco se ainda não foi restabelecida"
      />

      <TextField
        label="Hora de Fim"
        placeholder="HH:MM"
        value={horaFim}
        onChangeText={setHoraFim}
        containerStyle={$field}
      />

      {!!duracaoEstimada && (
        <Text style={$durationText}>
          ⏱️ Duração calculada: {duracaoEstimada}
        </Text>
      )}

      <TextField
        label="Observações sobre o Tempo"
        placeholder="Ex: Interrupção intermitente, energia voltou parcialmente..."
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={3}
        containerStyle={$field}
      />

      {hasExistingTimeInfo ? (
        <>
          <Text style={$existingDataText}>
            ✅ Informações de tempo já foram registradas. Você pode editá-las ou prosseguir para a próxima etapa.
          </Text>
          <Button
            text={isLoading ? "Salvando..." : "Atualizar Informações"}
            style={$saveButton}
            disabled={isLoading}
            onPress={handleSaveTime}
          />
          <Button
            text="Continuar para Prejuízos"
            style={$continueButton}
            onPress={() => navigation.navigate("DamagesForm", { eventId: actualEventId })}
          />
        </>
      ) : (
        <>
          <Button
            text={isLoading ? "Salvando..." : "Salvar Informações"}
            style={$saveButton}
            disabled={isLoading}
            onPress={handleSaveTime}
          />
          <Button
            text="Pular esta etapa"
            preset="reversed"
            style={$skipButton}
            onPress={() => navigation.navigate("DamagesForm", { eventId: actualEventId })}
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

const $sectionTitle: ViewStyle = {
  marginTop: 16,
  marginBottom: 12,
}

const $field: ViewStyle = {
  marginBottom: 16,
}

const $durationText: TextStyle = {
  marginBottom: 16,
  marginTop: -8,
  fontSize: 16,
  fontWeight: "600",
  color: "#007AFF",
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
