import { FC } from "react"
import { ViewStyle } from "react-native"

import { EventList, Header, Screen } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAppTheme } from "@/utils/useAppTheme"
// import { useNavigation } from "@react-navigation/native"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

// Tela 1 - Panorama Geral: Exibição de um resumo dos eventos registrados pelo usuário sobre falta de energia

export const HomeScreen: FC<HomeScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { theme } = useAppTheme()

  return (
    <Screen style={$root} preset="scroll">
      <Header title="Bem-Vindo" />
      <EventList style={{ padding: theme.spacing.md }} />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
