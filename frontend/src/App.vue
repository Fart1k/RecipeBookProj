<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { authReady, currentUser, authenticationsServices } from "./services/authenticationsServices";

const router = useRouter();

onMounted(() => {
    authenticationsServices.refresh();
});

async function logout() {
    await authenticationsServices.logout();
    await router.push("/login");
}
</script>

<template>
    <div class="window app-window">
        <div class="title-bar">
            <div class="title-bar-text">RecipeBook</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
            </div>
        </div>

        <div class="window-body has-space">
            <header class="app-header">
                <nav class="nav-bar">
                    <div class="nav-links">
                        <RouterLink to="/recipes" custom v-slot="{ navigate, isActive }">
                            <button :class="{ default: isActive }" @click="navigate">Recipes</button>
                        </RouterLink>
                        <RouterLink v-if="!currentUser" to="/register" custom v-slot="{ navigate, isActive }">
                            <button :class="{ default: isActive }" @click="navigate">Register</button>
                        </RouterLink>
                        <RouterLink v-if="!currentUser" to="/login" custom v-slot="{ navigate, isActive }">
                            <button :class="{ default: isActive }" @click="navigate">Login</button>
                        </RouterLink>
                    </div>

                    <div v-if="currentUser" class="user-controls">
                        <span>Account: <strong>{{ currentUser.UserName }}</strong></span>
                        <button type="button" @click="logout">Logout</button>
                    </div>
                </nav>
            </header>

            <main class="app-content">
                <RouterView v-if="authReady" />
            </main>
        </div>

        <div class="status-bar">
            <p class="status-bar-field">{{ authReady ? 'Ready' : 'Loading...' }}</p>
            <p class="status-bar-field">{{ currentUser ? `Logged in as ${currentUser.UserName}` : 'Guest' }}</p>
        </div>
    </div>
</template>

<style scoped>
.app-window {
    max-width: 900px;
    margin: 24px auto;
}

.app-header {
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid #d9d9d9;
}

.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.nav-links {
    display: flex;
    gap: 6px;
}

.user-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.app-content {
    min-height: 300px;
}
</style>