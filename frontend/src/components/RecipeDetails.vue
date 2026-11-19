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
  <section>
    <p v-if="loading">Loading recipe</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else-if="recipe">
      <h2>{{ recipe.RecipeTitle }}</h2>
      <img v-if="recipe.ImageUrl" :src="recipe.ImageUrl" :alt="recipe.RecipeTitle" class="recipe-image" />
      <h3>Ingredients</h3>
      <p class="preserve-lines">{{ recipe.Ingredients }}</p>
      <h3>Instructions</h3>
      <p class="preserve-lines">{{ recipe.Instructions }}</p>
      <p v-if="recipe.RatingOverall !== null">Rating: {{ recipe.RatingOverall }}</p>
      <div class="actions">
        <button type="button" @click="emit('edit')">Edit</button>
        <button type="button" class="danger" @click="emit('deleted')">Delete</button>
      </div>
    </div>
  </section>
</template>
