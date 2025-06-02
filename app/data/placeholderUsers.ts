import { User } from "types"

// Para nós seria mais flexível se esses dados fossem um object,
// mas estou fingindo que eles virão de um backend com database,
// que normalmente retornaria eles em uma lista como essa
export const users: User[] = [
  {
    id: "admin",
    name: "Administrador",
  },
  {
    id: "gPizzas",
    name: "Gero Pizzas",
  },
  {
    id: "jCaminhoes",
    name: "Jefferson Caminhões",
  },
  {
    id: "jLima",
    name: "João Lima",
  },
]
