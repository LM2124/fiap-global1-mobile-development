// https://vuetifyjs.com/en/styles/colors/#material-colors
const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F2F2F2",
  neutral300: "#CFCFCF",
  neutral400: "#ADADAD",
  neutral500: "#909090",
  neutral600: "#4F4F4F",
  neutral700: "#383838",
  neutral800: "#141414",
  neutral900: "#000000",

  primary100: "#C5CAE9",
  primary200: "#9FA8DA",
  primary300: "#7986CB",
  primary400: "#5C6BC0",
  primary500: "#3F51B5",
  primary600: "#3949AB",

  secondary100: "#F4E0D9",
  secondary200: "#E8C1B4",
  secondary300: "#DDA28E",
  secondary400: "#D28468",
  secondary500: "#C76542",

  accent100: "#E8EAF6",
  accent200: "#8C9EFF",
  accent300: "#536DFE",
  accent400: "#3D5AFE",
  accent500: "#304FFE",

  angry100: "#F2D6CD",
  angry500: "#CF0303",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary400,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const
