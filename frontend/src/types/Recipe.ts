export interface RecipeSummary {
  id: string
  RecipeTitle: string
}

export interface Recipe {
  id: string
  RecipeTitle: string
  Instructions: string
  Ingredients: string
  ImageUrl: string | null
  IsVisibleToOther: boolean
  Status: boolean
  RatingOverall: number | null
}

export interface RecipeInput {
  RecipeTitle: string
  Instructions: string
  Ingredients: string
  ImageUrl: string | null
  IsVisibleToOther: boolean
}
