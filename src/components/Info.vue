<!-- 
Info.vue is a pop-up window for displaying an informational message.
-->

<script setup lang="ts">

import { appState } from "@/appstate";

const state = appState();

/** When the "X" is clicked, ask AppState to hide this pop-up*/
function clear() {
    state.infoClear();
}
</script>

<template>
    <div v-if="state.info.show" style="display:block" class="w3-modal">
        <div class="w3-modal-content">
            <h2 class="w3-blue">&nbsp;Info</h2>
            <div class="w3-container">
                <span @click="clear" class="w3-button w3-display-topright">&times;</span>
                <p>{{ state.info.msg }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

