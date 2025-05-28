import { Evento } from "types"
import { users } from "./placeholderUsers"

export const events: Evento[] = [
  {
    idEvento: "1",
    autor: users[0],
    descricao: "Apagão na 23 de maio",
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "b",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "c",
      },
    ],
  },
  {
    idEvento: "2",
    autor: users[0],
    descricao: "Apagão na 23 de maio",
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "b",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "c",
      },
    ],
  },
  {
    idEvento: "3",
    autor: users[0],
    descricao: "Apagão na 23 de maio",
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "b",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "c",
      },
    ],
  },
]
