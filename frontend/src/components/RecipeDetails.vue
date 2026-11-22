<script>
import {ref,watch} from "vue"
import { recipeServices } from "@/services/recipeServices";
import type { Recipe } from "@/types/Recipe";

const props = defineProps<{
    RecipeID: string
}>()

const recipe = ref<recipe | null>(null)
    const error = ref("")
    const loading  = ref(false)

    async function loadRecipes(id: string) {
        recipe.value = null
        loading.value = true
        error.value = ""
        
        try{
            recipe.value = await recipeServices.getById(id)
        } catch (err){
            error.value = "cannot load recipe"
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    watch( () => props.RecipeID, loadRecipes, {immediate: true})

</script>

<template>
    <section>
        <h2>Recipe Details</h2>

        <p v-if="loading">Loading recipe info</p>
        <p v-else-if="error">{{error}}</p>
        <div v-else-if="recipe"></div>
        <h3>{{ recipe.recipeName }}</h3>
        <p>{{ recipe.recipeDescription }}</p>
        <p>{{ recipe.ReleaseDate }}</p>
        <!--     <p><img src="{{ recipe.ImageURL }}"></p>                 -->
        <P>{{ recipe.CategoryID }}</P>
        <p>{{ recipe.IsOwnedBy }}</p>
        <p>{{ recipe.Review }}</p>
        <p>{{ recipe.Comments }}</p>

    </section>
</template>

