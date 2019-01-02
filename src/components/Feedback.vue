<!-- 
  Feedback.vue lists all of the feedback messages, if the user is an admin and
  the route ends in "/view".  It provides a form for entering feedback if the
  user is not an admin or the route ends in "/create".
  -->
<template>
  <div>
    <div class="w3-container" v-if="!isAdmin" style="margin: 5px;">
      <label>Feedback</label>
      <textarea class="w3-input" v-model="message" placeholder="Your message"></textarea>
      <button @click="createFeedback" :disabled="buttonOff" class="w3-input">Create It</button>
    </div>

    <ul class="w3-ul w3-border" v-if="isAdmin">
      <li>
        <h2>All Feedback</h2>
      </li>
      <li v-for="elt in mydata" :key="elt.id">{{ elt.message }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";

export default Vue.extend({
  /**
   * The data for this Component consists of 'mydata', which holds all the
   * results from firebase, or the fields of the input form.
   */
  data(): any {
    return {
      mydata: [],
      /** The message body */
      message: "",
      buttonOff: false
    };
  },

  /**
   * We need a computed field for whether or not the user is admin.
   */
  computed: {
    isAdmin(): any {
      let state: AppState = (this.$parent as any).state;
      return state.user.isAdmin && this.$attrs.mode === "view";
    }
  },

  methods: {
    /** Common code to get data from firebase */
    load() {
      if (this.$attrs.mode !== "view") return;
      let state: AppState = (this.$parent as any).state;
      state.readallFeedback((res: any) => {
        this.mydata = res;
      });
    },

    /** Post a new feedback */
    createFeedback() {
      // start by validating that all fields are non-empty
      let state: AppState = (this.$parent as any).state;
      if (this.message === "") {
        state.errorShow("The last name cannot be blank");
        return;
      }
      // disable button, start posting the message
      this.buttonOff = true;
      state.createFeedback(
        this.message,
        () => {
          this.buttonOff = false;
          this.message = "";
          state.infoShow("Feedback created successfully.");
        },
        (error: any) => {
          this.buttonOff = false;
          this.status = "";
          state.errorShow("Feedback creation failed.");
        }
      );
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