//getall

export interface RecipeSummary {
    id:string,
    RecipeName: string
}
//getbyid/modifybyid
export interface Recipe {
    if: string,
    RecipeName: string,
    RecipeDescription: string,
    CategoryID: string,
    ImageURL: string | null,
    IsOwnedBy: number,
    Review: unknown | null,
    Comments: unknown | null

}
//create
export interface RecipeInput {
    RecipeName: string,
    RecipeDescription: string,
    CategoryID: string,
    ImageURL: string | null,
}
//categoryvalue
export interface Category {
    id:string,
    CategoryName: string
}