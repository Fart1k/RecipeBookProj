<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { recipeServices } from '../services/recipeServices'
import type { RecipeSummary } from '../types/Recipe'

const emit = defineEmits<{ select: [id: string] }>()
const recipes = ref<RecipeSummary[]>([])
const loading = ref(false)
const error = ref('')

async function loadRecipes() {
  loading.value = true
  error.value = ''

  try {
    recipes.value = await recipeServices.getAll()
  } catch (err) {
    error.value = 'Could not load recipes'
    console.error(err)
  } finally {
    loading.value = false
  }
}

defineExpose({ loadRecipes })
onMounted(loadRecipes)
</script>

<template>
  <div class="window" style="margin: 24px auto;">
    <div class="title-bar">
      <div class="title-bar-text">Recipe Directory</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>

    <div class="window-body">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0; font-size: 1rem;">Recipes</h2>
        <button type="button" @click="loadRecipes" :disabled="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div class="sunken-panel" style="background: white; height: 300px; overflow-y: auto; padding: 8px;">
        <p v-if="loading" style="text-align: center; margin-top: 20px;">Loading recipes...</p>
        <p v-else-if="error" role="alert" style="color: red; text-align: center; margin-top: 20px;">{{ error }}</p>
        <p v-else-if="recipes.length === 0" style="text-align: center; margin-top: 20px;">No recipes found.</p>
        
        <ul v-else class="tree-view" style="border: none; padding: 0;">
          <li v-for="recipe in recipes" :key="recipe.id" style="margin-bottom: 4px;">
            <button 
              type="button" 
              class="recipe-link" 
              @click="emit('select', recipe.id)"
              style="width: 100%; text-align: left; padding: 4px 8px;"
            >
              {{ recipe.RecipeTitle }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="status-bar">
      <p class="status-bar-field">Total: {{ recipes.length }} recipes</p>
      <p class="status-bar-field">{{ loading ? 'Fetching data...' : 'Ready' }}</p>
    </div>
  </div>
</template>

<style scoped>
.recipe-link {
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
}

.recipe-link:hover {
    background: #000080;
    color: white;
}
</style>