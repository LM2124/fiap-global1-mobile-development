import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FC, useEffect, useState } from "react"
import { Alert, Platform, TextStyle, ViewStyle } from "react-native"

import { Button, Header, Screen, Text, TextField } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"

type InterruptionTimeFormNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "InterruptionTimeForm"
>

interface InterruptionTimeFormScreenProps extends AppStackScreenProps<"InterruptionTimeForm"> {}

export const InterruptionTimeFormScreen: FC<InterruptionTimeFormScreenProps> = ({ route }) => {
  const navigation = useNavigation<InterruptionTimeFormNavigationProp>()
  const { eventId } = route.params || {}
  const actualEventId = eventId ?? 1

  const [dataInicio, setDataInicio] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [duracaoEstimada, setDuracaoEstimada] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [hasExistingTimeInfo, setHasExistingTimeInfo] = useState(false)
  const [showDateInicioPicker, setShowDateInicioPicker] = useState(false)
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false)
  const [showDateFimPicker, setShowDateFimPicker] = useState(false)
  const [showHoraFimPicker, setShowHoraFimPicker] = useState(false)

  const isWeb = Platform.OS === "web"

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

          // Define data e hora atuais como padrão
          const now = new Date()
          const today = now.toISOString().split("T")[0]
          const currentTime = now.toTimeString().slice(0, 5)

          if (!dataInicio) setDataInicio(today)
          if (!horaInicio) setHoraInicio(currentTime)
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      }
    }
    loadEvent()
  }, [actualEventId, dataInicio, horaInicio])

  useEffect(() => {
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
            const minutesText = minutes > 0 ? ` ${minutes}min` : ""
            setDuracaoEstimada(`${hours}h${minutesText}`)
          } else {
            setDuracaoEstimada(`${minutes}min`)
          }
        }
      } catch (error) {
        console.error("Erro de cálculo de duração:", error)
      }
    }
  }, [dataInicio, horaInicio, dataFim, horaFim])

  const validateDates = (): boolean => {
    let hasError = false
    if (!dataInicio) {
      Alert.alert("Por favor, informe a data de início da interrupção")
      hasError = true
    }
    if (!horaInicio) {
      Alert.alert("Por favor, informe a hora de início da interrupção")
      hasError = true
    }
    if (dataFim && horaFim) {
      const inicio = new Date(`${dataInicio}T${horaInicio}:00`)
      const fim = new Date(`${dataFim}T${horaFim}:00`)
      if (fim <= inicio) {
        Alert.alert("A data/hora de fim deve ser posterior à data/hora de início")
        hasError = true
      }
    }
    return !hasError
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
        dataFim && horaFim ? `\nFim: ${dataFim} às ${horaFim}` : ""
      }${duracaoEstimada ? `\nDuração: ${duracaoEstimada}` : ""}${
        observacoes ? `\nObservações: ${observacoes}` : ""
      }`

      const updatedDescription = event.descricao + timeDescription

      const success = await eventService.updateEvent(actualEventId, {
        descricao: updatedDescription,
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

  // Funções auxiliares para exibir valores formatados
  function formatDate(date: string) {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString()
  }
  function formatTime(time: string) {
    if (!time) return ""
    return time.length > 5 ? time.slice(11, 16) : time
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header
        title="Tempo de Interrupção"
        backgroundColor="#f8f9fa"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <Text preset="heading" style={$title}>
        Tempo de Interrupção
      </Text>

      {!!eventTitle && <Text style={$eventTitle}>Evento: {eventTitle}</Text>}

      <Text style={$subtitle}>Registre quando ocorreu a interrupção de energia</Text>

      <Text preset="subheading" style={$sectionTitle}>
        Início da Interrupção *
      </Text>

      {isWeb ? (
        <TextField
          label="Data de Início"
          placeholder="AAAA-MM-DD"
          value={dataInicio}
          onChangeText={setDataInicio}
          containerStyle={$field}
        />
      ) : (
        <Button
          text={
            dataInicio ? `Data de Início: ${formatDate(dataInicio)}` : "Selecionar Data de Início"
          }
          style={$field}
          onPress={() => !isWeb && setShowDateInicioPicker(true)}
          preset="reversed"
        />
      )}
      {showDateInicioPicker && (
        <DateTimePicker
          value={dataInicio ? new Date(dataInicio) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDateInicioPicker(false)
            if (selectedDate) {
              setDataInicio(selectedDate.toISOString().slice(0, 10))
            }
          }}
        />
      )}
      {isWeb ? (
        <TextField
          label="Hora de Início"
          placeholder="HH:MM"
          value={horaInicio}
          onChangeText={setHoraInicio}
          containerStyle={$field}
        />
      ) : (
        <Button
          text={
            horaInicio ? `Hora de Início: ${formatTime(horaInicio)}` : "Selecionar Hora de Início"
          }
          style={$field}
          onPress={() => !isWeb && setShowHoraInicioPicker(true)}
          preset="reversed"
        />
      )}
      {showHoraInicioPicker && (
        <DateTimePicker
          value={horaInicio ? new Date(`1970-01-01T${horaInicio}:00`) : new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowHoraInicioPicker(false)
            if (selectedDate) {
              const h = selectedDate.getHours().toString().padStart(2, "0")
              const m = selectedDate.getMinutes().toString().padStart(2, "0")
              setHoraInicio(`${h}:${m}`)
            }
          }}
        />
      )}
      <Text preset="subheading" style={$sectionTitle}>
        Fim da Interrupção (Opcional)
      </Text>
      {isWeb ? (
        <TextField
          label="Data de Fim"
          placeholder="AAAA-MM-DD"
          value={dataFim}
          onChangeText={setDataFim}
          containerStyle={$field}
        />
      ) : (
        <Button
          text={dataFim ? `Data de Fim: ${formatDate(dataFim)}` : "Selecionar Data de Fim"}
          style={$field}
          onPress={() => !isWeb && setShowDateFimPicker(true)}
          preset="reversed"
          disabled={isWeb}
        />
      )}
      {showDateFimPicker && (
        <DateTimePicker
          value={dataFim ? new Date(dataFim) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDateFimPicker(false)
            if (selectedDate) {
              setDataFim(selectedDate.toISOString().slice(0, 10))
            }
          }}
        />
      )}
      {isWeb ? (
        <TextField
          label="Hora de Fim"
          placeholder="HH:MM"
          value={horaFim}
          onChangeText={setHoraFim}
          containerStyle={$field}
        />
      ) : (
        <Button
          text={horaFim ? `Hora de Fim: ${formatTime(horaFim)}` : "Selecionar Hora de Fim"}
          style={$field}
          onPress={() => !isWeb && setShowHoraFimPicker(true)}
          preset="reversed"
        />
      )}
      {showHoraFimPicker && (
        <DateTimePicker
          value={horaFim ? new Date(`1970-01-01T${horaFim}:00`) : new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowHoraFimPicker(false)
            if (selectedDate) {
              const h = selectedDate.getHours().toString().padStart(2, "0")
              const m = selectedDate.getMinutes().toString().padStart(2, "0")
              setHoraFim(`${h}:${m}`)
            }
          }}
        />
      )}

      {!!duracaoEstimada && (
        <Text style={$durationText}>⏱️ Duração calculada: {duracaoEstimada}</Text>
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
            ✅ Informações de tempo já foram registradas. Você pode editá-las ou prosseguir para a
            próxima etapa.
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
  paddingHorizontal: 20,
  backgroundColor: "#f8f9fa",
}

const $title: TextStyle = {
  marginBottom: 8,
  marginTop: 16,
  textAlign: "center",
}

const $eventTitle: TextStyle = {
  marginBottom: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $subtitle: TextStyle = {
  marginBottom: 24,
  textAlign: "center",
  color: "#444",
}

const $sectionTitle: TextStyle = {
  marginTop: 16,
  marginBottom: 12,
  textAlign: "center",
}

const $field: ViewStyle = {
  marginBottom: 16,
  borderRadius: 10,
  backgroundColor: "#fff",
  padding: 12,
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
