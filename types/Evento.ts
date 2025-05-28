import { User } from "./User"

type Causas =
  | "Chuva"
  | "Vento"
  | "Deslizamento"
  | "Árvores"
  | "Infraestrutura"
  | "Outro"
  | "Desconhecido"

export interface Evento {
  idEvento: string
  autor: User

  // Breve descrição do evento
  // Ex. "transformador explodiu" ou "apagão na 23 de maio"
  descricao: string

  // Causas/Categorias do evento, se conhecidas
  // Ideia: Mostrar icone da causa na listagem do evento?
  // Ex. Icone de chuva se a causa é chuva
  causas: Causas[]

  // Estimativa de danos causados.
  // Ideia: Possivel interação = Usuários reportam seus danos?
  // Ex. "Perdi $1000 por causa do apagão" + Mostrar usuário?
  danos: { descricao: string; danoMonetario?: number; idAutor?: string }[]

  // Localização aproximada do apagão.
  // Ideia: usar coordenadas para mostrar um iframe do google maps da localização
  local: { descricao: string; coordenadas?: [number, number] }
}
