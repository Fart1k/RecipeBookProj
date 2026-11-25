<script setup lang="ts">
import { ref, watch } from 'vue'
import { recipeServices } from '../services/recipeServices'
import type { Recipe } from '../types/Recipe'

const props = defineProps<{ recipeId: string }>()
const emit = defineEmits<{ edit: []; deleted: [] }>()
const recipe = ref<Recipe | null>(null)
const error = ref('')
const loading = ref(false)

async function loadRecipe(id: string) {
  recipe.value = null
  loading.value = true
  error.value = ''

  try {
    recipe.value = await recipeServices.getById(id)
  } catch (err) {
    error.value = 'Could not load recipe'
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(() => props.recipeId, loadRecipe, { immediate: true })
</script>

<template>
  <div class="window" style="max-width: 700px; margin: 24px auto;">
    <div class="title-bar">
      <div class="title-bar-text">{{ recipe ? recipe.RecipeTitle : 'Recipe Details' }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>

    <div class="window-body">
      <p v-if="loading" style="text-align: center; margin: 20px 0;">Loading recipe...</p>
      <p v-else-if="error" role="alert" style="color: red; text-align: center; margin: 20px 0;">{{ error }}</p>
      
      <div v-else-if="recipe">
        <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
          <div v-if="recipe.ImageUrl" style="flex: 1; min-width: 200px;">
            <img :src="recipe.ImageUrl" :alt="recipe.RecipeTitle" class="recipe-image" style="width: 100%; height: auto; border: 1px solid #808080;" />
          </div>
          <div style="flex: 2; min-width: 250px;">
            <h2 style="margin-top: 0; border-bottom: 1px solid #808080; padding-bottom: 6px;">{{ recipe.RecipeTitle }}</h2>
            <p v-if="recipe.RatingOverall !== null"><strong>Rating:</strong> {{ recipe.RatingOverall }} / 5</p>
          </div>
        </div>

        <fieldset style="margin-top: 16px;">
          <legend>Ingredients</legend>
          <div class="sunken-panel" style="background: white; padding: 12px; min-height: 80px;">
            <p class="preserve-lines" style="margin: 0;">{{ recipe.Ingredients }}</p>
          </div>
        </fieldset>

        <fieldset style="margin-top: 16px;">
          <legend>Instructions</legend>
          <div class="sunken-panel" style="background: white; padding: 12px; min-height: 120px;">
            <p class="preserve-lines" style="margin: 0;">{{ recipe.Instructions }}</p>
          </div>
        </fieldset>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
          <button type="button" @click="emit('edit')">Edit</button>
          <button type="button" @click="emit('deleted')" style="color: red;">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preserve-lines {
  white-space: pre-wrap;
}
</style>