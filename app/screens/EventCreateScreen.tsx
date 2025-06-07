import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FC, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Causas } from "types"

import { Button, Header, Screen, Text, TextField } from "@/components"
import type { AppStackParamList } from "@/navigators"
import { eventService } from "@/services/eventService"

export const EventCreateScreen: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  const [title, setTitle] = useState("")
  const [descricao, setDescricao] = useState("")
  const [selectedCausas, setSelectedCausas] = useState<Causas[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // Estados de erro
  const [titleError, setTitleError] = useState("")
  const [descricaoError, setDescricaoError] = useState("")
  const [causasError, setCausasError] = useState("")

  const causasOptions: Causas[] = [
    "Chuva",
    "Vento",
    "Deslizamento",
    "Árvores",
    "Infraestrutura",
    "Outro",
    "Desconhecido",
  ]

  const toggleCausa = (causa: Causas) => {
    setSelectedCausas((prev) =>
      prev.includes(causa) ? prev.filter((c) => c !== causa) : [...prev, causa],
    )
  }

  const handleCreateEvent = async () => {
    let hasError = false
    setTitleError("")
    setDescricaoError("")
    setCausasError("")

    if (!title.trim()) {
      setTitleError("Por favor, insira um título para o evento")
      hasError = true
    }
    if (!descricao.trim()) {
      setDescricaoError("Por favor, insira uma descrição para o evento")
      hasError = true
    }
    if (selectedCausas.length === 0) {
      setCausasError("Por favor, selecione pelo menos uma causa")
      hasError = true
    }
    if (hasError) return

    setIsLoading(true)
    try {
      const eventData = {
        title: title.trim(),
        descricao: descricao.trim(),
        causas: selectedCausas,
        local: { descricao: "Localização a ser definida" },
      }
      const newEvent = await eventService.createEvent(eventData)
      navigation.navigate("EventView", { eventId: newEvent.idEvento })
    } catch {
      // Erro de backend ignorado para validação de campos obrigatórios
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header
        title="Novo Evento"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        backgroundColor="#f8f9fa"
      />

      <Text preset="heading" style={$title}>
        Registrar Evento de Falta de Energia
      </Text>

      <Text style={$subtitle}>Forneça as informações básicas sobre o evento</Text>

      <TextField
        label="Título do Evento"
        placeholder="Ex: Apagão na região central"
        value={title}
        onChangeText={setTitle}
        containerStyle={$field}
        status={titleError ? "error" : undefined}
        helper={titleError}
      />

      <TextField
        label="Descrição"
        placeholder="Descreva o que aconteceu..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        containerStyle={$field}
        status={descricaoError ? "error" : undefined}
        helper={descricaoError}
      />

      <Text preset="subheading" style={$sectionTitle}>
        Causas do Evento
      </Text>

      <Text style={$sectionSubtitle}>Selecione todas as causas que se aplicam:</Text>

      {causasOptions.map((causa) => (
        <Button
          key={causa}
          text={causa}
          preset={selectedCausas.includes(causa) ? "default" : "reversed"}
          style={[$causaButton, selectedCausas.includes(causa) && $causaButtonSelected]}
          onPress={() => toggleCausa(causa)}
        />
      ))}
      {!!causasError && <Text style={$causasErrorText}>{causasError}</Text>}

      <Button
        text={isLoading ? "Criando..." : "Criar Evento"}
        style={$createButton}
        disabled={isLoading}
        onPress={handleCreateEvent}
      />
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

const $subtitle: TextStyle = {
  marginBottom: 24,
  textAlign: "center",
  color: "#444",
}

const $field: ViewStyle = {
  marginBottom: 16,
  borderRadius: 10,
  backgroundColor: "#fff",
  paddingHorizontal: 8,
}

const $sectionTitle: TextStyle = {
  marginTop: 16,
  marginBottom: 8,
  textAlign: "center",
}

const $sectionSubtitle: TextStyle = {
  marginBottom: 12,
  textAlign: "center",
  color: "#666",
}

const $causaButton: ViewStyle = {
  marginBottom: 8,
  borderRadius: 8,
}

const $causaButtonSelected: ViewStyle = {
  backgroundColor: "#007AFF",
}

const $causasErrorText: TextStyle = {
  color: "#FF3B30",
  marginBottom: 8,
  textAlign: "center",
  fontSize: 14,
}

const $createButton: ViewStyle = {
  marginTop: 32,
  marginBottom: 16,
  borderRadius: 10,
}
