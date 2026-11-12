import { application } from "express"
import type {Recipe, RecipeSummary, RecipeInput, Category} from "../types/Recipe"
import { receiveMessageOnPort } from "worker_threads"
const API_URL = import.meta.env.VITE_BACKEND_URL

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(API_URL + endpoint, options)

    if(!response.ok){
        throw new Error(
            `Request has failed, status is: ${response.status}`
        )
    }
    if(response.status === 204){
        return undefined as T
    }
    return response.json() as Promise<T>
}
/*service*/

export const recipeServices = {
    getAll(): Promise<RecipeSummary[]> {   
    return request<RecipeSummary[]>("/recipes")
},
getById(id: string): Promise<Recipe>
{
    return request<Recipe>(`/recipes/${id}`)
},
create(Recipe:RecipeInput): Promise<void>{
    return request<void>("/recipes",{
        method: "POST",
        headers: {
            "Content - Type:": "application/json"
        },
        body: JSON.stringify(Recipe)
    })
},
update(id: string, recipes: RecipeInput): Promise<void>{
    return request<void>(`/recipes/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(recipes)
    })
},
delete(id:string): Promise<void> {
    return request<void>(`/recipes/${id}`,{
        method: "DELETE"
    })
}
}