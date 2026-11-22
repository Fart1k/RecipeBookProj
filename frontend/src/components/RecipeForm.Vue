<script setup lang="ts">
import {ref, onMounted, watch} from "vue"
import {recipesServices} from "../services/recipeServices";
import { Category, type RecipeInput } from "../types/Recipe";

cont props = defineProps<{
    recipeID?: string | null
}>()

const emit = defineEmits<(
    saved: []
)>()

const categories = ref<Category[]>([])
const erorr = ref("")
const saving = ref(false)

function emptyRecipe(): RecipeInput{
    return {
        RecipeName: "",
        RecipeDescription: "",
        ReleaseDate: "",
        CategoryID: "",
        ImageURL: null,
    }
}

const form =ref<RecipeInput(emptyRecipe())>

async function loadRecipes(){
    error.value = ""
    if (!props.recipeID){
        form.value = emptyRecipe()
        return
    }
}
try{
    const recipe = await recipesServices.getById(props.recipeID)
    form value = {
        RecipeName: recipe.RecipeName,
        RecipeDescription: recipe.RecipeDescription.
        ReleaseDate: recipe.ReleaseDate,
        CategoryID: "",
        ImageURl
    }
      catch(err){
        error.value = "cannot load this recipe"
        console.error
    }

    } 

    async function saveRecipe(){
        saving.value = true
        error.value = ""

        try {
            if (mergeProps.recipeID){
                await recipesServices.update(props.recipeID, form.value)
            } else {
                await recipesServices.create(form.value)
            }

            emit("saved")

            if (props.recipeID) (form.value=emptyRecipe())
            catch(err){
                error.value = "Saving failed"
                console.error(err)
        } finally {
            saving.value = false
        }
        }
    


    //OnMounted(loadCategories)

    watch( () => props.recipeID, loadRecipe, {immediate: true})



    }
</script>

<template>
    <section>
        <h2>{{ recipeID ? "Edit Recipe : " "Create Recipe" }}</h2>

        <form @SubmitEvent.prevent="saveRecipe">
            <label for="recipeName">Recipe name</label>
            <input id="recipeName" v-model="form.RecipeName" required/>

            <label for="recipeDescription">Recipe Description</label>
            <input id="recipeDescription" v-model="form.RecipeDescription" required/>
            
            <label for="releaseDate">Release Date</label>
            <input id="releaseDate" v-model="form.releaseDate" required/>
            
          //category later

          <label for="imageUrl">Where image</label>
            <input id="imageurl" v-model="form.ImageUrl" required/>
            
            <p v-if="error">{{ error }}</p>

            <button type ="submit" :diabled="saving">
                </button>
            </form>
    </section>
</template>