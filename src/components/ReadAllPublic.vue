<!-- 
ReadAllPublic.vue lists all of the public messages.  It only shows the
subjects. Clicking a row will lead to the rest of the information being shown.
-->
<template>
    <div>
        <ul class="w3-ul w3-border">
            <li>
                <h2>Public Messages</h2>
            </li>
            <li @click="click(elt.id)" class="w3-hover-blue" v-for="elt in localState.mydata" :key="elt.id">{{
                elt.subject
            }}</li>
            <li>As of {{ localState.when }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Routes, Router } from "@/router";
import { appState } from "@/appstate";
import { onBeforeMount, reactive } from "vue";

let globalState = appState;

const localState = reactive({
    when: "---",
    mydata: [] as any[],
});

function load() {
    globalState().readallPublicDoc((res: any) => {
        localState.mydata = res;
        localState.when = new Date().toString();
    });
}

onBeforeMount(load);

/** Clicking a row should take us to the details page for that row */
function click(id: number) {
    Router.replace(Routes.readOnePublic + "/" + id);
}
</script>
