import { FlatList, StyleProp, ViewStyle } from "react-native"

import { events } from "@/data"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

import { Event } from "./Event"

export interface EventListProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Renderiza lista de eventos.
 * Extremamente temporário.
 */
export const EventList = (props: EventListProps) => {
  const { style } = props
  const { themed } = useAppTheme()

  return (
    <FlatList
      contentContainerStyle={[themed($container), style]}
      data={events}
      renderItem={({ item: event }) => <Event event={event} />}
      keyExtractor={(event) => event.idEvento.toString()}
    />
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  gap: spacing.sm,
})
