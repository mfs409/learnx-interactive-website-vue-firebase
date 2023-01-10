<!-- 
Feedback.vue lists all of the feedback messages, if the user is an admin and
the route ends in "/view".  It provides a form for entering feedback if the
user is not an admin or the route ends in "/create".
-->
<template>
    <div>
        <div class="w3-container" v-if="!isAdmin()" style="margin: 5px;">
            <label>Feedback</label>
            <textarea class="w3-input" v-model="localState.message" placeholder="Your message"></textarea>
            <button @click="createFeedback" :disabled="localState.buttonOff" class="w3-input">Create It</button>
        </div>

        <ul class="w3-ul w3-border" v-if="isAdmin()">
            <li>
                <h2>All Feedback</h2>
            </li>
            <li v-for="elt in localState.mydata" :key="elt.id">{{ elt.message }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { appState } from "@/appstate";
import { onBeforeMount, reactive } from 'vue';
import { Router } from '@/router';

const globalState = appState();

const localState = reactive({
    mydata: [] as any[],
    message: "",
    buttonOff: false,
});

/**
 * We need a computed field for whether or not the user is admin.
 */
function isAdmin() {
    let route = Router.currentRoute.value.path.split("/")[2];
    let res = globalState.user.isAdmin && route === "view";
    return res;
}

/** Common code to get data from firebase */
function load() {
    if (!isAdmin())
        return;
    globalState.readallFeedback((res: any) => {
        localState.mydata = res;
    });
}

/** Post a new feedback */
function createFeedback() {
    // start by validating that all fields are non-empty
    if (localState.message === "") {
        globalState.errorShow("The last name cannot be blank");
        return;
    }
    // disable button, start posting the message
    localState.buttonOff = true;
    globalState.createFeedback(
        localState.message,
        () => {
            localState.buttonOff = false;
            localState.message = "";
            globalState.infoShow("Feedback created successfully.");
        },
        (error: any) => {
            localState.buttonOff = false;
            globalState.errorShow("Feedback creation failed.");
        }
    );
}

onBeforeMount(load);
</script>