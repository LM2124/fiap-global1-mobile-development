import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useMemo } from "react"
import { ViewStyle } from "react-native"
import { Evento } from "types"

import { Text } from "@/components/Text"
import type { AppStackParamList } from "@/navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

import { Card } from "./Card"
import { Icon } from "./Icon"

type EventNavigationProps = NativeStackNavigationProp<AppStackParamList, "Home">

export interface EventProps {
  event: Evento
}

/**
 * Renderiza um Evento
 */
export const Event = (props: EventProps) => {
  const { event } = props
  const { themed } = useAppTheme()
  const navigation = useNavigation<EventNavigationProps>()

  const danoTotal = useMemo(
    () =>
      event.danos
        .map((dano) => dano.danoMonetario ?? 0)
        .filter((dano) => dano > 0)
        .reduce((a, b) => a + b, 0),
    [event.danos],
  )

  return (
    <Card
      onPress={() => navigation.navigate("EventView", { eventId: event.idEvento })}
      heading={event.title}
      RightComponent={<Icon icon="caretRight" containerStyle={themed($accessoryContainer)} />}
      ContentComponent={
        <>
          <Text>{event.descricao}</Text>

          <Text>
            <Text preset="bold">Causas:</Text> {event.causas.join(", ")}
          </Text>

          {danoTotal > 0 && (
            <Text>
              <Text preset="bold">Dano monetário total:</Text> R$ {danoTotal?.toFixed(2)}
            </Text>
          )}
        </>
      }
      footer={event.dataHora.toLocaleDateString() + " | Registrado por: " + event.autor.name}
    />
  )
}

const $accessoryContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
})
