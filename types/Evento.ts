import { User } from "./User"

export type Causas =
  | "Chuva"
  | "Vento"
  | "Deslizamento"
  | "Árvores"
  | "Infraestrutura"
  | "Outro"
  | "Desconhecido"

export type Danos = { descricao: string; danoMonetario?: number; idAutor?: string }

export type Local = { descricao: string; coordenadas?: [number, number] }

export interface Evento {
  idEvento: number
  autor: User
  title: string
  descricao: string
  dataHora: Date
  causas: Causas[]
  danos: Danos[]
  local: Local
}
