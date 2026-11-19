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
  <section>
    <h2>{{ recipeId ? 'Edit recipe' : 'Create recipe' }}</h2>
    <form @submit.prevent="saveRecipe">
      <label for="recipe-title">Recipe title</label>
      <input id="recipe-title" v-model.trim="form.RecipeTitle" required />

      <label for="recipe-ingredients">Ingredients</label>
      <textarea id="recipe-ingredients" v-model.trim="form.Ingredients" required rows="4" />

      <label for="recipe-instructions">Instructions</label>
      <textarea id="recipe-instructions" v-model.trim="form.Instructions" required rows="6" />

      <label for="recipe-image">Image URL</label>
      <input id="recipe-image" v-model.trim="form.ImageUrl" type="url" />

      <p v-if="error" role="alert">{{ error }}</p>
      <div class="actions">
        <button type="submit" :disabled="saving">{{ saving ? 'Saving' : 'Save recipe' }}</button>
        <button type="button" class="secondary" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>
