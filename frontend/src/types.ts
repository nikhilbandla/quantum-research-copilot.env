export type Dependency = {
  status: 'ok' | 'error' | 'unavailable'
  detail: string
  configured_model?: string
  model_available?: boolean
  models?: string[]
}

export type DependencyReport = {
  postgres: Dependency
  qdrant: Dependency
  ollama: Dependency
}
