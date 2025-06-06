import { FC, useState } from "react"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button, Header, Screen, Text, TextField } from "@/components"
import { eventService } from "@/services/eventService"
import { Causas } from "types"
import type { AppStackParamList } from "@/navigators"

export const EventCreateScreen: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  
  const [title, setTitle] = useState("")
  const [descricao, setDescricao] = useState("")
  const [selectedCausas, setSelectedCausas] = useState<Causas[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const causasOptions: Causas[] = [
    "Chuva", "Vento", "Deslizamento", "Árvores", "Infraestrutura", "Outro", "Desconhecido"
  ]

  const toggleCausa = (causa: Causas) => {
    setSelectedCausas(prev => 
      prev.includes(causa) 
        ? prev.filter(c => c !== causa)
        : [...prev, causa]
    )
  }

  const handleCreateEvent = async () => {
    console.log("=== Iniciando criação de evento ===")
    console.log("Título:", title)
    console.log("Descrição:", descricao)
    console.log("Causas selecionadas:", selectedCausas)

    if (!title.trim()) {
      Alert.alert("Erro", "Por favor, insira um título para o evento")
      return
    }

    if (!descricao.trim()) {
      Alert.alert("Erro", "Por favor, insira uma descrição para o evento")
      return
    }

    if (selectedCausas.length === 0) {
      Alert.alert("Erro", "Por favor, selecione pelo menos uma causa")
      return
    }

    setIsLoading(true)
    
    try {
      console.log("=== Chamando eventService.createEvent ===")
      const eventData = {
        title: title.trim(),
        descricao: descricao.trim(),
        causas: selectedCausas,
        local: { descricao: "Localização a ser definida" }
      }
      console.log("Dados do evento:", eventData)

      const newEvent = await eventService.createEvent(eventData)
      console.log("=== Evento criado com sucesso ===")
      console.log("Novo evento:", newEvent)
      console.log("Navegando para EventView com eventId:", newEvent.idEvento)
      
      navigation.navigate("EventView", { eventId: newEvent.idEvento })
    } catch (error) {
      console.error("=== ERRO ao criar evento ===")
      console.error("Tipo do erro:", typeof error)
      console.error("Erro completo:", error)
      console.error("Mensagem do erro:", error instanceof Error ? error.message : String(error))
      console.error("Stack trace:", error instanceof Error ? error.stack : "N/A")
      Alert.alert("Erro", "Não foi possível criar o evento. Tente novamente.")
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
      />
      
      <Text preset="heading" style={$title}>
        Registrar Evento de Falta de Energia
      </Text>
      
      <Text style={$subtitle}>
        Forneça as informações básicas sobre o evento
      </Text>

      <TextField
        label="Título do Evento"
        placeholder="Ex: Apagão na região central"
        value={title}
        onChangeText={setTitle}
        containerStyle={$field}
      />

      <TextField
        label="Descrição"
        placeholder="Descreva o que aconteceu..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        containerStyle={$field}
      />

      <Text preset="subheading" style={$sectionTitle}>
        Causas do Evento
      </Text>
      
      <Text style={$sectionSubtitle}>
        Selecione todas as causas que se aplicam:
      </Text>

      {causasOptions.map((causa) => (
        <Button
          key={causa}
          text={causa}
          preset={selectedCausas.includes(causa) ? "default" : "reversed"}
          style={[
            $causaButton,
            selectedCausas.includes(causa) && $causaButtonSelected
          ]}
          onPress={() => toggleCausa(causa)}
        />
      ))}

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

const $createButton: ViewStyle = {
  marginTop: 32,
  marginBottom: 16,
  borderRadius: 10,
}
