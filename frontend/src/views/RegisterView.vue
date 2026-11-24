<script setup lang="ts">
import { useRouter } from "vue-router";
import RegisterForm from "../components/RegisterForm.vue";

const router = useRouter();

function registered() {
    router.push("/login");
}
</script>

<template>
    <main>
        <RegisterForm @registered="registered" />
    </main>
</template>
