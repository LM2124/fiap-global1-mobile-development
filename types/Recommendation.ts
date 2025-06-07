export type RecommendationPriority = "high" | "medium" | "low"

export interface Recommendation {
  title: string
  description: string
  icon: string
  priority: RecommendationPriority
}
