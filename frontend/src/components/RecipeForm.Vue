<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { recipeServices } from '../services/recipeServices'
import type { RecipeInput } from '../types/Recipe'

const props = defineProps<{ recipeId?: string | null }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()

const emptyRecipe = (): RecipeInput => ({
  RecipeTitle: '',
  Instructions: '',
  Ingredients: '',
  ImageUrl: null,
  IsVisibleToOther: false,
})

const form = reactive<RecipeInput>(emptyRecipe())
const error = ref('')
const saving = ref(false)

async function loadRecipe() {
  error.value = ''
  Object.assign(form, emptyRecipe())

  if (!props.recipeId) return

  try {
    const recipe = await recipeServices.getById(props.recipeId)
    Object.assign(form, {
      RecipeTitle: recipe.RecipeTitle,
      Instructions: recipe.Instructions,
      Ingredients: recipe.Ingredients,
      ImageUrl: recipe.ImageUrl,
      IsVisibleToOther: recipe.IsVisibleToOther,
    })
  } catch (err) {
    error.value = 'Could not load recipe'
    console.error(err)
  }
}

async function saveRecipe() {
  saving.value = true
  error.value = ''

  try {
    const payload = { ...form, IsVisibleToOther: props.recipeId ? form.IsVisibleToOther : false }
    if (props.recipeId) {
      await recipeServices.update(props.recipeId, payload)
    } else {
      await recipeServices.create(payload)
    }
    emit('saved')
  } catch (err) {
    error.value = 'Could not save recipe'
    console.error(err)
  } finally {
    saving.value = false
  }
}

watch(() => props.recipeId, loadRecipe, { immediate: true })
</script>

<template>
  <div class="window" style="max-width: 600px; margin: 24px auto;">
    <div class="title-bar">
      <div class="title-bar-text">{{ recipeId ? 'Edit Recipe' : 'Create Recipe' }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close" @click="emit('cancel')"></button>
      </div>
    </div>

    <div class="window-body">
      <form @submit.prevent="saveRecipe">
        <fieldset>
          <legend>Recipe Details</legend>

          <div class="field-row-stacked" style="margin-bottom: 12px;">
            <label for="recipe-title">Recipe title</label>
            <input id="recipe-title" v-model.trim="form.RecipeTitle" required />
          </div>

          <div class="field-row-stacked" style="margin-bottom: 12px;">
            <label for="recipe-ingredients">Ingredients</label>
            <textarea id="recipe-ingredients" v-model.trim="form.Ingredients" required rows="4"></textarea>
          </div>

          <div class="field-row-stacked" style="margin-bottom: 12px;">
            <label for="recipe-instructions">Instructions</label>
            <textarea id="recipe-instructions" v-model.trim="form.Instructions" required rows="6"></textarea>
          </div>

          <div class="field-row-stacked" style="margin-bottom: 12px;">
            <label for="recipe-image">Image URL</label>
            <input id="recipe-image" v-model.trim="form.ImageUrl" type="url" />
          </div>
        </fieldset>

        <p v-if="error" role="alert" class="error-box">{{ error }}</p>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
          <button type="submit" :disabled="saving" class="default">
            {{ saving ? 'Saving...' : 'Save recipe' }}
          </button>
          <button type="button" @click="emit('cancel')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.error-box {
    background: #ffe6e6;
    border: 1px solid red;
    padding: 8px;
    margin-top: 12px;
    font-size: 0.9rem;
}
</style>