import { eventService } from "@/services/eventService"

// Função para criar dados de teste
export const createTestData = async () => {
  try {
    // Evento 1
    await eventService.createEvent({
      title: "Queda de Energia na Zona Sul",
      descricao: "Interrupção no fornecimento de energia elétrica que afetou toda a região da zona sul da cidade.",
      causas: ["Chuva", "Vento"],
      local: { 
        descricao: "Zona Sul - Bairros: Vila Madalena, Pinheiros, Jardins" 
      },
      danos: [
        {
          descricao: "Perda de alimentos na geladeira",
          danoMonetario: 150.00,
          idAutor: "João Silva"
        },
        {
          descricao: "Equipamentos eletrônicos danificados",
          danoMonetario: 800.00,
          idAutor: "Maria Santos"
        }
      ]
    })

    // Evento 2  
    await eventService.createEvent({
      title: "Apagão no Centro Comercial",
      descricao: "Falta de energia que durou 6 horas e afetou lojas e escritórios do centro da cidade.",
      causas: ["Infraestrutura"],
      local: { 
        descricao: "Centro Comercial - Rua das Flores, 123" 
      },
      danos: [
        {
          descricao: "Perda de vendas no comércio",
          danoMonetario: 2500.00,
          idAutor: "Loja ABC"
        }
      ]
    })

    // Evento 3
    await eventService.createEvent({
      title: "Interrupção por Queda de Árvore",
      descricao: "Árvore caiu sobre fiação elétrica durante tempestade, causando interrupção.",
      causas: ["Árvores", "Vento"],
      local: { 
        descricao: "Rua dos Pinheiros, altura do número 456" 
      },
      danos: []
    })

    console.log("Dados de teste criados com sucesso!")
  } catch (error) {
    console.error("Erro ao criar dados de teste:", error)
  }
}
