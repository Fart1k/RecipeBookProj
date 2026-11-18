<script setup lang="ts">
import { ref } from "vue"
import RecipeList from './components/RecipeList.vue';
import RecipeDetails from "./components/RecipeDetails.vue";
import RecipeForm from "../components/RecipeForm.vue"
import { recipeServices } from "./services/recipeServices.ts";

const selectedRecipeId = ref<string | null>(null)
  const editing = ref(false)
  const listVersion = ref(0)
  const detailsVersion = ref(0)
  const error = ref("")


  function selectedRecipe(id: string){
    selectedRecipeId.value = id
    editing.value = false
  }

  function createRecipe() {
    selectedRecipeId.value = null
    editing.value = true
  }
  
  function recipeSaved(){
    editing.value = false
    listVersion.value++
    detailsVersion.value++
  }

async function deleteRecipe(){
  if(!selectedRecipeId.value) return
  if (!confirm("Delete this recipe?")) return
  
  error.value = ""

  try{
    await recipeServices.delete(selectedRecipeID.value)
    selectedRecipeID.value = null
    editing.value = false
    listVersion.value++
    } catch(err){
      error.value="Cannot delete this recipe"
      console.error(err)
    }
}
</script>

<template>
  <main> 
  <h1>You Did it!</h1>
  <button @click="createRecipe">Add recipe</button>
  <p v-if="error">{{ error }}</p>
  <p>
    <RecipeList  :key="listVersion"
    @select="selectedRecipe"
    />

    <section v-if="selectedRecipeId && !editing"  :recipe-ID ="selectedRecipeId">
      <RecipeDetails>
        :keys="´${selectedRecipeId}`"
        :recipe-id="selectedGameId"
      </RecipeDetails>


    </section>

    <section v-if="editing">
      <button @click="editing = true">Edit</button>
      <RecipeForm>
        :recipe-id="selectedRecipeId"
        @SAVED="recipeSaved"
      </RecipeForm>
    </section>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  </main>
</template>

<style scoped></style>
