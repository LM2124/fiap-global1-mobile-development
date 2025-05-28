import { EventList, Header, Screen } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { FC } from "react"
import { ViewStyle } from "react-native"
// import { useNavigation } from "@react-navigation/native"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

// Tela 1 - Panorama Geral: Exibição de um resumo dos eventos registrados pelo usuário sobre falta de energia

export const HomeScreen: FC<HomeScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Header title="Bem-Vindo" />
      <EventList />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
