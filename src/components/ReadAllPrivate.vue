<!-- 
ReadAllPrivate.vue lists all of the private messages.  It only shows the
subjects. Clicking a row will lead to the rest of the information being shown.
This is mostly just a copy-and-paste of ReadAllPublic.vue.
-->
<template>
    <div>
        <ul class="w3-ul w3-border">
            <li>
                <h2>Private Messages</h2>
            </li>
            <li @click="click(elt.id)" class="w3-hover-blue" v-for="elt in localState.mydata" :key="elt.id">
                {{ elt.subject }}
            </li>
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

/** Clicking a row should take us to the details page for that row */
function click(id: string) {
    let who = Router.currentRoute.value.path.split("/")[3];
    Router.replace(
        Routes.readOnePrivate + "/" + who + "/" + id
    );
}

/** Common code to get data from firebase */
function load() {
    let who = Router.currentRoute.value.path.split("/")[3];
    globalState().readallPrivateDoc(who, (res: any) => {
        localState.mydata = res;
        localState.when = new Date().toString();
    });
}

onBeforeMount(load);
</script>
