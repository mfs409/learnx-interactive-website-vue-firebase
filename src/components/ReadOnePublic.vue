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
        <h1>{{ subject }}</h1>
      </header>
      <div class="w3-container" style="margin: 5px;">
        <label>Subject</label>
        <input class="w3-input" type="text" v-model="subject" placeholder="Loading...">
        <label>Message</label>
        <textarea class="w3-input" v-model="message" placeholder="Loading..."></textarea>
        <img :src="imgSrc" width="30%">
        <button @click="updateIt" class="w3-input">Update It</button>
        <button @click="deleteIt" class="w3-input">Delete It</button>
      </div>
    </div>
    <!-- This is how we display the component if the user can't edit -->
    <div class="w3-container w3-margin" v-if="!editable">
      <header class="w3-container w3-blue">
        <h1>{{ subject }}</h1>
      </header>
      <div class="w3-container" style="margin: 5px;">
        <div>{{message}}</div>
        <img :src="imgSrc" width="30%">
        <hr>
        <span>As of {{timestamp}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";
import { Routes } from "../router";

export default Vue.extend({
  /**
   * The data for this component is a bit complicated.  See inside for details
   */
  data(): any {
    return {
      /** loaded is for preventing update/delete before the data is showing */
      loaded: false,
      /** the message subject */
      subject: "",
      /** the message body */
      message: "",
      /** the id of this message */
      id: this.$attrs.id,
      /** the URL for showing the image */
      imgSrc: "",
      /** the ID of the creator of the message */
      creator: "",
      /** the creation time of the message */
      timestamp: ""
    };
  },

  /**
   * We need a computed field for whether or not the message can be edited.
   * This is because the decision is based on two facts that are generated
   * asynchronously: the Id of the user, and the user's admin permissions.
   */
  computed: {
    editable() {
      let state: AppState = (this.$parent as any).state;
      if (this.creator === state.user.token) return true;
      return state.user.isAdmin;
    }
  },

  methods: {
    /** Update the message with the new subject and message body */
    updateIt() {
      if (!this.loaded) return;
      let state: AppState = (this.$parent as any).state;
      state.updatePublicDoc(this.id, this.subject, this.message);
    },

    /** Delete the message and return to the message listing */
    deleteIt() {
      if (!this.loaded) return;
      let state: AppState = (this.$parent as any).state;
      state.deletePublicDoc(this.id, () => {
        state.infoShow("Document successfully deleted!");
        this.$parent.$router.replace(Routes.readAllPublic);
      });
    },

    /** Common code to get data from firebase */
    load() {
      let state: AppState = (this.$parent as any).state;
      state.readonePublicDoc(this.$attrs.id, (res: any) => {
        this.subject = res.subject;
        this.message = res.message;
        this.creator = res.creator;
        // format the date
        let d = new Date(1970, 0, 1); // Epoch
        d.setSeconds(res.timestamp.seconds);
        this.timestamp = d.toString();
        // Converting the fileId into an image URL is a bit tricky:
        if (!res.fileId) return;
        console.log(res.fileId);
        let urlTask = state.getPublicFileUrl(res.fileId);
        urlTask
          .then(url => (this.imgSrc = url))
          .catch(error => state.errorShow("Error loading image..."));
        // we'll say the buttons should work even before the image finishes
        // loading.
        this.loaded = true;
      });
    }
  },

  /** When the component is refreshed, get the data */
  beforeRouteUpdate() {
    this.load();
  },

  /** When the component loads, get the data */
  mounted() {
    this.load();
  }
});
</script>