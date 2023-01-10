<!-- 
ReadOnePublic.vue shows everything about a single public message.  It also
allows updating and deleting, but only if the current user is the one who
created this message (or is admin).
-->
<template>
    <div class="w3-card-4">
        <!-- This is how we display the component if the user is allowed to edit -->
        <div class="w3-container w3-margin" v-if="editable">
            <header class="w3-container w3-blue">
                <h1>{{ localState.subject }}</h1>
            </header>
            <div class="w3-container" style="margin: 5px;">
                <label>Subject</label>
                <input class="w3-input" type="text" v-model="localState.subject" placeholder="Loading...">
                <label>Message</label>
                <textarea class="w3-input" v-model="localState.message" placeholder="Loading..."></textarea>
                <img :src="localState.imgSrc">
                <button @click="updateIt" class="w3-input">Update It</button>
                <button @click="deleteIt" class="w3-input">Delete It</button>
            </div>
        </div>
        <!-- This is how we display the component if the user can't edit -->
        <div class="w3-container w3-margin" v-if="!editable">
            <header class="w3-container w3-blue">
                <h1>{{ localState.subject }}</h1>
            </header>
            <div class="w3-container" style="margin: 5px;">
                <div>{{ localState.message }}</div>
                <img :src="localState.imgSrc">
                <hr>
                <span>As of {{ localState.timestamp }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import { appState } from "@/appstate";
import { computed, onBeforeMount, reactive } from 'vue';
import { Routes, Router } from '@/router';

/** The Id */
let id: string = useRoute().params.id as string;

const globalState = appState();

const localState = reactive({
    loaded: false,
    subject: "",
    message: "",
    id: "",
    imgSrc: "",
    creator: "",
    timestamp: "---",
});

/** Report if the current user is allowed to edit this post */
const editable = computed(() => {
    if (localState.creator === globalState.user.token) return true;
    return globalState.user.isAdmin;
})

/** Update the message with the new subject and message body */
function updateIt() {
    if (!localState.loaded)
        return;
    globalState.updatePublicDoc(localState.id, localState.subject, localState.message);
}

/** Delete the message and return to the message listing */
function deleteIt() {
    if (!localState.loaded)
        return;
    globalState.deletePublicDoc(localState.id, () => {
        globalState.infoShow("Document successfully deleted!");
        Router.replace(Routes.readAllPublic);
    });
}

function load() {
    globalState.readonePublicDoc(id, (e) => {
        localState.subject = e.subject;
        localState.message = e.message;
        localState.creator = e.creator;
        let d = new Date(1970, 0, 1); // Epoch
        d.setSeconds(e.timestamp.seconds);
        localState.timestamp = d.toString();
        localState.id = e.id;
        localState.loaded = true;

        // Converting the fileId into an image URL is a bit tricky:
        if (!e.fileId) return;
        let urlTask = globalState.getPublicFileUrl(e.fileId);
        urlTask
            .then(url => (localState.imgSrc = url))
            .catch(error => globalState.errorShow("Error loading image..."));
    });
}
onBeforeMount(load);
</script>

<style scoped>
img {
    width: 100%;
    max-width: 600px;
    height: auto;
}
</style>