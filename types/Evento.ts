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

  // Objeto User de quem reportou o evento.
  // Considerando remover completamente.
  autor: User

  // Brevíssima descrição do evento
  // Ex. "transformador explodiu" ou "apagão na 23 de maio"
  title: string

  // Descrição mais detalhada do evento
  // Ex. "fortes tempestades na zona leste causaram múltiplos incidentes (...)"
  descricao: string

  // Data/hora cadastrada do evento
  dataHora: Date

  // Causas/Categorias do evento, se conhecidas
  // Ideia: Mostrar icone da causa na listagem do evento?
  // Ex. Icone de chuva se a causa é chuva
  causas: Causas[]

  // Estimativa de danos causados.
  // Ideia: Possivel interação = Usuários reportam seus danos?
  // Ex. "Perdi $1000 por causa do apagão" + Mostrar usuário?
  danos: Danos[]

  // Localização aproximada do apagão.
  // Ideia: usar coordenadas para mostrar um iframe do google maps da localização
  local: Local
}
