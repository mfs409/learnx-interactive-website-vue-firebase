<!-- 
Login.vue is a simple log-in page.  It consists of a red message to log in,
and a link for logging in.  When the link is clicked, we let the top-level
AppState do all the work.
-->
<template>
    <header class="w3-container w3-red w3-center" style="padding:128px 16px">
        <h1 class="w3-margin w3-jumbo">Log In Required</h1>
        <h2>You must log in to use this program</h2>
        <h3>
            <button @click="state.logIn()" class="w3-button">Log In</button>
        </h3>
    </header>
</template>

<script setup lang="ts">
import { appState } from "@/appstate";
const state = appState();
</script>
