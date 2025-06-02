import { FC } from "react"
import { ViewStyle } from "react-native"

import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
// import { useNavigation } from "@react-navigation/native"

interface EventViewScreenProps extends AppStackScreenProps<"EventView"> {}

export const EventViewScreen: FC<EventViewScreenProps> = ({ route }) => {
  // Pull in navigation via hook
  // const navigation = useNavigation()

  return (
    <Screen style={$root} preset="scroll">
      <Text preset="heading">boa tarde evento id: {route.params.eventId}</Text>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
