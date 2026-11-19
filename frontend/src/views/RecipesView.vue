<script setup lang="ts">
import { ref } from 'vue'
import RecipeDetails from '../components/RecipeDetails.vue'
import RecipeForm from '../components/RecipeForm.vue'
import RecipeList from '../components/RecipeList.vue'
import { recipeServices } from '../services/recipeServices'

const selectedRecipeId = ref<string | null>(null)
const editing = ref(false)
const listVersion = ref(0)
const error = ref('')
const recipeList = ref<InstanceType<typeof RecipeList> | null>(null)

function selectRecipe(id: string) {
  selectedRecipeId.value = id
  editing.value = false
  error.value = ''
}

function createRecipe() {
  selectedRecipeId.value = null
  editing.value = true
  error.value = ''
}

function recipeSaved() {
  editing.value = false
  selectedRecipeId.value = null
  listVersion.value++
  recipeList.value?.loadRecipes()
}

async function deleteRecipe() {
  if (!selectedRecipeId.value || !window.confirm('Delete this recipe?')) return

  error.value = ''
  try {
    await recipeServices.delete(selectedRecipeId.value)
    selectedRecipeId.value = null
    editing.value = false
    listVersion.value++
    recipeList.value?.loadRecipes()
  } catch (err) {
    error.value = 'Could not delete recipe'
    console.error(err)
  }
}
</script>

<template>
  <main>
    <div class="page-heading">
      <h1>My recipes</h1>
      <button type="button" @click="createRecipe">Add recipe</button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <div class="content-grid">
      <RecipeList ref="recipeList" :key="listVersion" @select="selectRecipe" />
      <RecipeDetails
        v-if="selectedRecipeId && !editing"
        :recipe-id="selectedRecipeId"
        @edit="editing = true"
        @deleted="deleteRecipe"
      />
      <RecipeForm
        v-else-if="editing"
        :recipe-id="selectedRecipeId"
        @saved="recipeSaved"
        @cancel="editing = false"
      />
      <p v-else class="empty-state">Select a recipe to see its details or add a new recipe</p>
    </div>
  </main>
</template>
