<!-- 
  CreatePrivate.vue is for making new private messages.  This is mostly just a
  copy-and-paste of CreatePublic.vue.
  -->
<template>
  <div class="w3-container" style="margin: 5px;">
    <h1 class="w3-blue w3-padding">Create a Private Message</h1>
    <label>Subject</label>
    <input class="w3-input" type="text" v-model="subject" placeholder="Your private subject">
    <label>Message</label>
    <textarea class="w3-input" v-model="message" placeholder="Your private message"></textarea>
    <input ref="fileInput" class="w3-input" type="file" accept="image/*">
    <button @click="createMessage" :disabled="buttonOff" class="w3-input">Create It</button>
    <span>{{status}}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";
import * as firebase from "firebase/app";
import "firebase/storage";

export default Vue.extend({
  /**
   * The data for this component is mostly related to managing the user
   * interface
   */
  data(): any {
    return {
      /** The subject of the new message */
      subject: "",
      /** The message body */
      message: "",
      /** The Id for the file to upload */
      id: "",
      /** for disabling the button */
      buttonOff: false,
      /** The status, which changes during the upload steps (after click) */
      status: ""
    };
  },
  methods: {
    /**
     * When the "Create It" button is clicked, this code will run to start the
     * process of making the post.  The whole process is (1) make sure all
     * fields are filled out, (2) get an Id for the file, (3) upload the file,
     * (4) upload the message.  createMessage() does (1) and (2).
     */
    createMessage() {
      // start by validating that all fields are non-empty
      let state: AppState = (this.$parent as any).state;
      if (this.subject === "") {
        state.errorShow("The first name cannot be blank");
        return;
      }
      if (this.message === "") {
        state.errorShow("The last name cannot be blank");
        return;
      }
      if (this.$refs.fileInput.files.length == 0) {
        state.errorShow("No file was provided");
        return;
      }
      // Disable the upload button and start the process of posting a message,
      // by creating a file ID
      this.buttonOff = true;
      this.status = "Generating file ID";
      state.getFileId(
        // on success, start uploading file
        (id: string) => {
          this.status = "Uploading file: 0%";
          this.upload(id);
        },
        // on error, back out
        (error: any) => {
          this.buttonOff = false;
          this.status = "";
          state.errorShow("Error generating ID: " + error);
        }
      );
    },

    /** Once we have a unique ID for the file, we can upload it via this code */
    upload(id: string) {
      let state: AppState = (this.$parent as any).state;
      // get the file from the form, create the metadata for the file
      let file = this.$refs.fileInput.files[0];
      let metadata = { contentType: file.type };
      // upload it!
      let uploadTask = state.uploadPrivateImage(id, file, metadata);
      // We'll run some code on state changes, so we can have a progress bar
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // progress bar update
        (snap: any) => {
          // update status with upload progress
          var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
          this.status = "Uploading file: " + progress + "%";
          if (snap.state == firebase.storage.TaskState.PAUSED)
            this.status = "Uploading file: paused";
        },
        // error
        (error: any) => {
          this.status = "";
          this.buttonOff = false;
          state.errorShow("File upload error.  Please try again.");
          // For more nuanced error handling, see
          // https://firebase.google.com/docs/storage/web/handle-errors
        },
        // success... time to actually create the message
        () => this.postMessage(id)
      );
    },

    /**
     * After a file has been properly created, we can create the database entry
     * for the message.
     */
    postMessage(fileId: string) {
      let state: AppState = (this.$parent as any).state;
      this.status = "Creating message";
      // create the doc.  If it succeeds, clean up.  Otherwise, make an error
      // message.
      state.createPrivateDoc(
        fileId,
        this.subject,
        this.message,
        () => {
          this.buttonOff = false;
          this.$refs.fileInput.type = "text";
          this.$refs.fileInput.type = "file";
          this.subject = this.message = this.status = "";
          state.infoShow("Message created successfully.");
        },
        (error: any) => {
          this.buttonOff = false;
          this.status = "";
          state.errorShow("Message creation failed.");
        }
      );
    }
  }
});
</script>