import { Text } from "@/components/Text"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useMemo } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { Evento } from "types"

export interface EventProps {
  event: Evento

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Renderiza um Evento
 */
export const Event = (props: EventProps) => {
  const { event, style } = props
  const { themed } = useAppTheme()
  const $styles = [themed($eventContainer), style]

  const estDamage = useMemo(
    () =>
      event.danos
        .map((dano) => dano.danoMonetario)
        .filter((dano) => dano && dano > 0)
        .reduce((a, b) => (a || 0) + (b || 0)),
    [event.danos],
  )

  return (
    <View style={$styles}>
      <Text preset="heading">{event.descricao}</Text>
      <Text preset="subheading">Causas: {event.causas.join(", ")}</Text>
      {(estDamage || 0) > 0 && <Text>Dano monetário total: R$ {estDamage?.toFixed(2)}</Text>}
      <Text>
        Registrado por: <b>{event.autor.name}</b>
      </Text>
    </View>
  )
}

const $eventContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  justifyContent: "center",
  padding: spacing.lg,
  borderRadius: spacing.lg,
  backgroundColor: colors.tint,
})
