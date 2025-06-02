import { subDays } from "date-fns"
import { Evento } from "types"

import { users } from "./placeholderUsers"

// Para nós seria mais flexível se esses dados fossem um object,
// mas estou fingindo que eles virão de um backend com database,
// que normalmente retornaria eles em uma lista como essa
export const events: Evento[] = [
  {
    idEvento: 1,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 2,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 3,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 4,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 5,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 6,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
  {
    idEvento: 7,
    autor: users[0],
    title: "Apagão na 23 de maio",
    descricao: "Fortes tempestades na zona leste causaram múltiplos incidentes (...)",
    dataHora: subDays(Date.now(), 1), // 1 dia atrás
    causas: ["Chuva", "Árvores"],
    local: { descricao: "Avenida 23 de maio" },
    danos: [
      {
        descricao: "Perdi todas as carnes do meu freezer",
        danoMonetario: 20000,
        idAutor: "gPizzas",
      },
      {
        descricao: "Meu funcionário bateu o caminhão no escuro!",
        danoMonetario: 5000,
        idAutor: "jCaminhoes",
      },
    ],
  },
]
