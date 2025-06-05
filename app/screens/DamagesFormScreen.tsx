import { FC, useState, useEffect } from "react"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button, Header, Screen, Text, TextField } from "@/components"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { eventService } from "@/services/eventService"
import { Danos } from "types"

type DamagesFormNavigationProp = NativeStackNavigationProp<AppStackParamList, "DamagesForm">

interface DamagesFormScreenProps extends AppStackScreenProps<"DamagesForm"> {}

export const DamagesFormScreen: FC<DamagesFormScreenProps> = ({ route }) => {
  const navigation = useNavigation<DamagesFormNavigationProp>()
  const { eventId } = route.params || {}
  const actualEventId = eventId ?? 1 // Default para teste se não houver eventId

  const [descricaoDano, setDescricaoDano] = useState("")
  const [valorMonetario, setValorMonetario] = useState("")
  const [nomeAutor, setNomeAutor] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [savedDamages, setSavedDamages] = useState<Danos[]>([])
  const [hasExistingDamages, setHasExistingDamages] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await eventService.getEventById(actualEventId)
        if (event) {
          setEventTitle(event.title)
          setSavedDamages(event.danos)
          if (event.danos && event.danos.length > 0) {
            setHasExistingDamages(true)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      }
    }
    loadEvent()
  }, [actualEventId])

  const formatCurrency = (value: string): string => {
    // Remove tudo que não for dígito
    const numericValue = value.replace(/\D/g, "")
    
    if (!numericValue) return ""
    
    // Converte para centavos
    const cents = parseInt(numericValue, 10)
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  const parseCurrencyToNumber = (value: string): number => {
    if (!value) return 0
    // Remove símbolos de moeda e converte para número
    const numericValue = value.replace(/[^\d,]/g, "").replace(",", ".")
    return parseFloat(numericValue) || 0
  }

  const handleCurrencyChange = (text: string) => {
    const formatted = formatCurrency(text)
    setValorMonetario(formatted)
  }

  const handleAddDamage = async () => {
    if (!descricaoDano.trim()) {
      Alert.alert("Erro", "Por favor, descreva o prejuízo causado")
      return
    }

    setIsLoading(true)

    try {
      const newDamage: Danos = {
        descricao: descricaoDano.trim(),
        danoMonetario: parseCurrencyToNumber(valorMonetario),
        idAutor: nomeAutor.trim() || "Usuário Anônimo"
      }

      const success = await eventService.addDamageToEvent(actualEventId, newDamage)

      if (success) {
        // Atualiza a lista local
        setSavedDamages(prev => [...prev, newDamage])
        
        // Limpa os campos
        setDescricaoDano("")
        setValorMonetario("")
        setNomeAutor("")

        Alert.alert("Sucesso", "Prejuízo adicionado com sucesso!")
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o prejuízo. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao adicionar prejuízo:", error)
      Alert.alert("Erro", "Não foi possível adicionar o prejuízo. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    // Navega automaticamente para as recomendações
    navigation.navigate("Recommendations", { eventId: actualEventId })
  }

  const getTotalDamages = (): number => {
    return savedDamages.reduce((total, dano) => total + (dano.danoMonetario ?? 0), 0)
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header 
        title="Prejuízos Causados" 
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      
      <Text preset="heading" style={$title}>
        Prejuízos Causados
      </Text>
      
      {!!eventTitle && (
        <Text style={$eventTitle}>
          Evento: {eventTitle}
        </Text>
      )}
      
      <Text style={$subtitle}>
        Registre os prejuízos causados pela falta de energia
      </Text>

      {savedDamages.length > 0 && (
        <>
          <Text preset="subheading" style={$sectionTitle}>
            Prejuízos Já Registrados ({savedDamages.length})
          </Text>
          
          {savedDamages.map((dano, index) => (
            <Text key={`damage-${dano.descricao}-${index}`} style={$damageItem}>
              • {dano.descricao}
              {dano.danoMonetario && dano.danoMonetario > 0 && (
                <Text style={$damageValue}>
                  {"\n"}  Valor: R$ {dano.danoMonetario.toFixed(2)}
                </Text>
              )}
              {dano.idAutor && (
                <Text style={$damageAuthor}>
                  {"\n"}  Por: {dano.idAutor}
                </Text>
              )}
            </Text>
          ))}
          
          <Text style={$totalValue}>
            💰 Total em prejuízos: R$ {getTotalDamages().toFixed(2)}
          </Text>
        </>
      )}

      <Text preset="subheading" style={$sectionTitle}>
        Adicionar Novo Prejuízo
      </Text>

      <TextField
        label="Descrição do Prejuízo *"
        placeholder="Ex: Perdi toda a comida da geladeira, equipamentos queimaram..."
        value={descricaoDano}
        onChangeText={setDescricaoDano}
        multiline
        numberOfLines={3}
        containerStyle={$field}
      />

      <TextField
        label="Valor Monetário (Opcional)"
        placeholder="R$ 0,00"
        value={valorMonetario}
        onChangeText={handleCurrencyChange}
        keyboardType="numeric"
        containerStyle={$field}
        helper="Estimativa do prejuízo em reais"
      />

      <TextField
        label="Seu Nome/Identificação (Opcional)"
        placeholder="Ex: João Silva, Empresa XYZ..."
        value={nomeAutor}
        onChangeText={setNomeAutor}
        containerStyle={$field}
        helper="Para identificar quem reportou este prejuízo"
      />

      <Button
        text={isLoading ? "Adicionando..." : "Adicionar Prejuízo"}
        style={$addButton}
        disabled={isLoading}
        onPress={handleAddDamage}
      />

      <Text style={$infoText}>
        💡 Você pode adicionar múltiplos prejuízos ao mesmo evento. Cada prejuízo será registrado separadamente.
      </Text>

      {hasExistingDamages ? (
        <>
          <Text style={$existingDataText}>
            ✅ Prejuízos já foram registrados. Você pode adicionar mais ou finalizar.
          </Text>
          <Button
            text="Ver Recomendações"
            style={$continueButton}
            onPress={handleFinish}
          />
          <Button
            text="Voltar ao Início"
            preset="reversed"
            style={$finishButton}
            onPress={() => navigation.navigate("Home")}
          />
        </>
      ) : (
        <Button
          text="Pular e Finalizar"
          preset="reversed"
          style={$finishButton}
          onPress={handleFinish}
        />
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

const $damageItem: ViewStyle = {
  marginBottom: 12,
  padding: 12,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
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

const $totalValue: TextStyle = {
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

const $addButton: ViewStyle = {
  marginTop: 8,
  marginBottom: 16,
}

const $infoText: TextStyle = {
  marginBottom: 24,
  fontSize: 14,
  lineHeight: 20,
  textAlign: "center",
}

const $finishButton: ViewStyle = {
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
  marginBottom: 12,
}
