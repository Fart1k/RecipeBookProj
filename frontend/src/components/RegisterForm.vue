<script setup lang="ts">
import { ref } from "vue";
import { usersServices } from "../services/usersServices";

const emit = defineEmits<{ registered: [] }>();
const UserName = ref("");
const EmailAddress = ref("");
const Password = ref("");
const PasswordConfirmation = ref("");
const error = ref("");
const saving = ref(false);

async function register() {
    saving.value = true;
    error.value = "";

    try {
        await usersServices.register({
            UserName: UserName.value,
            EmailAddress: EmailAddress.value,
            Password: Password.value,
            PasswordConfirmation: PasswordConfirmation.value
        });
        emit("registered");
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Registration failed";
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div class="window" style="max-width: 480px; margin: 24px auto;">
        <div class="title-bar">
            <div class="title-bar-text">Register New Account</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
            </div>
        </div>

        <div class="window-body">
            <form @submit.prevent="register">
                <fieldset>
                    <legend>User Information</legend>
                    
                    <div class="field-row-stacked" style="margin-bottom: 12px;">
                        <label for="username">Username</label>
                        <input id="username" v-model.trim="UserName" required />
                    </div>

                    <div class="field-row-stacked" style="margin-bottom: 12px;">
                        <label for="email">Email address</label>
                        <input id="email" v-model.trim="EmailAddress" type="email" required />
                    </div>

                    <div class="field-row-stacked" style="margin-bottom: 12px;">
                        <label for="password">Password</label>
                        <input id="password" v-model="Password" type="password" required />
                    </div>

                    <div class="field-row-stacked" style="margin-bottom: 12px;">
                        <label for="password-confirmation">Confirm password</label>
                        <input id="password-confirmation" v-model="PasswordConfirmation" type="password" required />
                    </div>
                </fieldset>

                <div v-if="error" role="alert" class="error-box">
                    {{ error }}
                </div>

                <div style="text-align: right; margin-top: 16px;">
                    <button type="submit" :disabled="saving" class="default">
                        {{ saving ? "Registering..." : "Register" }}
                    </button>
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