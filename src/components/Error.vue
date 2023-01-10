<!-- 
Error.vue is a pop-up window for displaying an error message.
-->
<template>
    <div v-if="state.error.show" style="display:block" class="w3-modal">
        <div class="w3-modal-content">
            <h2 class="w3-red">&nbsp;Error</h2>
            <div class="w3-container">
                <span @click="clear" class="w3-button w3-display-topright">&times;</span>
                <p>{{ state.error.msg }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { appState } from "@/appstate";

const state = appState();

/** When the "X" is clicked, ask AppState to hide this pop-up*/
function clear() {
    state.errorClear();
}
</script>
