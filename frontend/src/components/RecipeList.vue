<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {recipeServices} from  '../services/recipeServices';
import type { RecipeSummary } from '@/types/Recipe';

const Recipe = ref<RecipeSummary[]>([])
const loading = ref(false)
const error = ref("")

async function loadRecipes(){
    loading.value = true 
    error.value = ""

    try {
        Recipe.value = await recipeServices.getAll()
    } catch (err){
        error.value = "cannot load games, skill issue"
        console.log(err)
    } finally {
        loading.value = false
    }
}

onMounted(loadRecipes)
</script>

<template>
    <section>
        <h2>Recipes</h2>
        <button @click="loadRecipes">Refresh</button>
        <p v-if="loading">Loading recipes..</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else-if="Recipe.length === 0">No recipes have found</p>
        <ul v-else>
            <li v-for="Recipe in Recipe" :key="Recipe.id">
                {{ Recipe.RecipeName }} ({{ Recipe.id }})

            </li>
        </ul>
    </section>
</template>