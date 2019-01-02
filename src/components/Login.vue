<!-- 
  Login.vue is a simple log-in page.  It consists of a red message to log in,
  and a link for logging in.  When the link is clicked, we let the top-level
  AppState do all the work.
  -->
<template>
  <header class="w3-container w3-red w3-center" style="padding:128px 16px">
    <h1 class="w3-margin w3-jumbo">Log In Required</h1>
    <h2>You must log in to use this program</h2>
    <h3>
      <button @click="login" class="w3-button">Log In</button>
    </h3>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";

export default Vue.extend({
  methods: {
    /** login() is called when the user clicks the log-in button. */
    login() {
      let state: AppState = (this.$parent as any).state as AppState;
      state.logIn();
    }
  }
});
</script>