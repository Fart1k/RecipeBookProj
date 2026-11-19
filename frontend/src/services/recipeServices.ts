import type { Recipe, RecipeInput, RecipeSummary } from '../types/Recipe'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options)

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function jsonOptions(method: 'POST' | 'PUT', recipe: RecipeInput): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  }
}

export const recipeServices = {
  getAll(): Promise<RecipeSummary[]> {
    return request<RecipeSummary[]>('/recipes')
  },
  getById(id: string): Promise<Recipe> {
    return request<Recipe>(`/recipes/${id}`)
  },
  create(recipe: RecipeInput): Promise<Recipe> {
    return request<Recipe>('/recipes', jsonOptions('POST', recipe))
  },
  update(id: string, recipe: RecipeInput): Promise<void> {
    return request<void>(`/recipes/${id}`, jsonOptions('PUT', recipe))
  },
  delete(id: string): Promise<void> {
    return request<void>(`/recipes/${id}`, { method: 'DELETE' })
  },
}
