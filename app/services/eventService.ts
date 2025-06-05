import { Evento, Local, Causas, Danos } from "types"
import * as storage from "@/utils/storage"

export interface EventCreateData {
  title: string
  descricao: string
  causas: Causas[]
  local: Local
  danos?: Danos[]
}

class EventService {
  private readonly EVENTS_KEY = "events"
  private readonly NEXT_ID_KEY = "nextEventId"
  // Carregar todos os eventos
  async getAllEvents(): Promise<Evento[]> {
    try {
      const events = await storage.load<Evento[]>(this.EVENTS_KEY)
      if (!events) return []
      
      // Converte strings de data de volta para objetos Date
      return events.map(event => ({
        ...event,
        dataHora: new Date(event.dataHora)
      }))
    } catch {
      return []
    }
  }

  // Salvar todos os eventos
  private async saveEvents(events: Evento[]): Promise<boolean> {
    return await storage.save(this.EVENTS_KEY, events)
  }
  // Obter próximo ID
  private async getNextId(): Promise<number> {
    try {
      const nextId = await storage.load<number>(this.NEXT_ID_KEY)
      const id = nextId ?? 1
      await storage.save(this.NEXT_ID_KEY, id + 1)
      return id
    } catch {
      await storage.save(this.NEXT_ID_KEY, 2)
      return 1
    }
  }  // Criar um novo evento
  async createEvent(data: EventCreateData): Promise<Evento> {
    console.log("=== EventService.createEvent iniciado ===")
    console.log("Dados recebidos:", data)

    try {
      console.log("Carregando eventos existentes...")
      const events = await this.getAllEvents()
      console.log("Eventos existentes carregados:", events.length, "eventos")

      console.log("Obtendo próximo ID...")
      const nextId = await this.getNextId()
      console.log("Próximo ID obtido:", nextId)

      const newEvent: Evento = {
        idEvento: nextId,
        autor: { 
          id: "user1", 
          name: "Usuário Local"
        }, // User mockado por enquanto
        title: data.title,
        descricao: data.descricao,
        dataHora: new Date(),
        causas: data.causas,
        local: data.local,
        danos: data.danos ?? []
      }

      console.log("Novo evento criado em memória:", newEvent)

      events.push(newEvent)
      console.log("Evento adicionado à lista. Total de eventos agora:", events.length)

      console.log("Salvando eventos...")
      const saveResult = await this.saveEvents(events)
      console.log("Resultado do salvamento:", saveResult)

      if (!saveResult) {
        throw new Error("Falha ao salvar o evento no storage")
      }

      console.log("=== EventService.createEvent concluído com sucesso ===")
      return newEvent
    } catch (error) {
      console.error("=== ERRO em EventService.createEvent ===")
      console.error("Erro:", error)
      throw error
    }
  }

  // Obter evento por ID
  async getEventById(id: number): Promise<Evento | null> {
    try {
      const events = await this.getAllEvents()
      return events.find(event => event.idEvento === id) || null
    } catch {
      return null
    }
  }

  // Atualizar evento
  async updateEvent(id: number, updates: Partial<Evento>): Promise<boolean> {
    try {
      const events = await this.getAllEvents()
      const index = events.findIndex(event => event.idEvento === id)
      
      if (index === -1) return false
      
      events[index] = { ...events[index], ...updates }
      return await this.saveEvents(events)
    } catch {
      return false
    }
  }

  // Adicionar localização a um evento
  async addLocationToEvent(eventId: number, local: Local): Promise<boolean> {
    return await this.updateEvent(eventId, { local })
  }

  // Adicionar danos a um evento
  async addDamageToEvent(eventId: number, dano: Danos): Promise<boolean> {
    try {
      const event = await this.getEventById(eventId)
      if (!event) return false
      
      const updatedDanos = [...event.danos, dano]
      return await this.updateEvent(eventId, { danos: updatedDanos })
    } catch {
      return false
    }
  }

  // Remover evento
  async deleteEvent(id: number): Promise<boolean> {
    try {
      const events = await this.getAllEvents()
      const filteredEvents = events.filter(event => event.idEvento !== id)
      return await this.saveEvents(filteredEvents)
    } catch {
      return false
    }
  }
}

export const eventService = new EventService()
