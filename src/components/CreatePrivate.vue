<!-- 
CreatePrivate.vue is for making new private messages.  This is mostly just a
copy-and-paste of CreatePublic.vue.
-->
<template>
    <div class="w3-container" style="margin: 5px;">
        <h1 class="w3-blue w3-padding">Create a Private Message</h1>
        <label>Subject</label>
        <input class="w3-input" type="text" v-model="localState.subject" placeholder="Your private subject">
        <label>Message</label>
        <textarea class="w3-input" v-model="localState.message" placeholder="Your private message"></textarea>
        <label>File</label>
        <input ref="fileInput" class="w3-input" type="file" accept="image/*">
        <button @click="createMessage" :disabled="localState.buttonOff" class="w3-input">Create It</button>
        <span>{{ localState.status }}</span>
    </div>
</template>

<script setup lang="ts">

import { appState } from "@/appstate";
import { reactive, ref } from "vue";

const globalState = appState();

const localState = reactive({
    subject: "",
    message: "",
    buttonOff: false,
    status: "",
});

/**
 * When the "Create It" button is clicked, this code will run to start the
 * process of making the post.  The whole process is (1) make sure all
 * fields are filled out, (2) get an Id for the file, (3) upload the file,
 * (4) upload the message.  createMessage() does (1) and (2).
 */
function createMessage() {
    // start by validating that all fields are non-empty
    if (localState.subject === "") {
        globalState.errorShow("The subject cannot be blank");
        return;
    }
    if (localState.message === "") {
        globalState.errorShow("The message cannot be blank");
        return;
    }
    if ((fileInput.value! as HTMLInputElement).files!.length == 0) {
        globalState.errorShow("No file was provided");
        return;
    }
    // Disable the upload button and start the process of posting a message,
    // by creating a file ID
    localState.buttonOff = true;
    localState.status = "Generating file ID";
    globalState.getFileId(
        // on success, start uploading file
        (id: string) => {
            localState.status = "Uploading file: 0%";
            upload(id);
        },
        // on error, back out
        (error: any) => {
            localState.buttonOff = false;
            localState.status = "";
            globalState.errorShow("Error generating ID: " + error);
        }
    );
}

/** Once we have a unique ID for the file, we can upload it via this code */
function upload(id: string) {
    // get the file from the form, create the metadata for the file
    let file = (fileInput.value! as HTMLInputElement).files![0];
    let metadata = { contentType: file.type };
    // upload it!
    let uploadTask = globalState.uploadPrivateImage(id, file, metadata);
    // We'll run some code on state changes, so we can have a progress bar
    uploadTask.on(
        'state_changed',
        // progress bar update
        (snap: any) => {
            // update status with upload progress
            var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            localState.status = "Uploading file: " + progress + "%";
            if (snap.state == 'paused')
                localState.status = "Uploading file: paused";
        },
        // error
        (error: any) => {
            localState.status = "";
            localState.buttonOff = false;
            globalState.errorShow("File upload error.  Please try again.");
            // For more nuanced error handling, see
            // https://firebase.google.com/docs/storage/web/handle-errors
        },
        // success... time to actually create the message
        () => postMessage(id)
    );
}

/**
 * After a file has been properly created, we can create the database entry
 * for the message.
 */
function postMessage(fileId: string) {
    localState.status = "Creating message";
    // create the doc.  If it succeeds, clean up.  Otherwise, make an error
    // message.
    globalState.createPrivateDoc(
        fileId,
        localState.subject,
        localState.message,
        () => {
            localState.buttonOff = false;
            (fileInput.value! as HTMLInputElement).type = "text";
            (fileInput.value! as HTMLInputElement).type = "file";
            localState.subject = localState.message = localState.status = "";
            globalState.infoShow("Message created successfully.");
        },
        (error: any) => {
            localState.buttonOff = false;
            localState.status = "";
            globalState.errorShow("Message creation failed.");
        }
    );
}

const fileInput = ref(null);
</script>