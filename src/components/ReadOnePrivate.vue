<!-- 
ReadOnePrivate.vue shows everything about a single private message.  It also
allows updating and deleting, but only if the current user is the one who
created this message (or is admin).  This is mostly just a copy-and-paste of
ReadOnePublic.vue.
-->
<template>
    <div class="w3-card-4">
        <div class="w3-container w3-margin">
            <header class="w3-container w3-blue">
                <h1>Private Document</h1>
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
    </div>
</template>

<script setup lang="ts">
import { appState } from "@/appstate";
import { onBeforeMount, reactive } from 'vue';
import { Routes, Router } from '@/router';

const globalState = appState();

const localState = reactive({
    loaded: false,
    subject: "",
    message: "",
    docId: "",
    userId: "",
    imgSrc: "",
    creator: "",
    timestamp: "---"
});

/** Update the message with the new subject and message body */
function updateIt() {
    if (!localState.loaded)
        return;
    globalState.updatePrivateDoc(localState.userId, localState.docId, localState.subject, localState.message);
}

/** Delete the message and return to the message listing */
function deleteIt() {
    if (!localState.loaded) return;
    globalState.deletePrivateDoc(localState.userId, localState.docId, () => {
        globalState.infoShow("Document successfully deleted!");
        Router.replace(Routes.readAllPrivate + "/" + globalState.user.token);
    });
}

/** Common code to get data from firebase */
function load() {
    let who = Router.currentRoute.value.path.split("/")[3];
    let what = Router.currentRoute.value.path.split("/")[4];
    globalState.readonePrivateDoc(
        who,
        what,
        (res: any) => {
            localState.subject = res.subject;
            localState.message = res.message;
            localState.creator = res.creator;
            localState.docId = what;
            localState.userId = who;
            // format the date
            let d = new Date(1970, 0, 1); // Epoch
            d.setSeconds(res.timestamp.seconds);
            localState.timestamp = d.toString();
            // Converting the fileId into an image URL is a bit tricky:
            if (!res.fileId) return;
            let urlTask = globalState.getPrivateFileUrl(res.fileId);
            urlTask
                .then(url => (localState.imgSrc = url))
                .catch(error => globalState.errorShow("Error loading image..."));
            // we'll say the buttons should work even before the image finishes
            // loading.
            localState.loaded = true;
        }
    );
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