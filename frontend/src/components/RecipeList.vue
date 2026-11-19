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
  <section>
    <div class="section-heading">
      <h2>Recipes</h2>
      <button type="button" @click="loadRecipes" :disabled="loading">Refresh</button>
    </div>
    <p v-if="loading">Loading recipes</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="recipes.length === 0">No recipes found</p>
    <ul v-else>
      <li v-for="recipe in recipes" :key="recipe.id">
        <button type="button" class="recipe-link" @click="emit('select', recipe.id)">
          {{ recipe.RecipeTitle }}
        </button>
      </li>
    </ul>
  </section>
</template>
