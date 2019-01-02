<!-- 
  Menu.vue is the menu that appears at the top when a user is logged in.  It
  contains buttons that cause the router to show different components in 
  App.vue's <router-view>.
  -->
<template>
  <div v-if="state.user.loggedIn" id="menu" class="w3-bar w3-black">
    <button @click="allPublic" class="w3-bar-item w3-button">Public</button>
    <button @click="createPublic" class="w3-bar-item w3-button">Create Public</button>
    <button @click="allPrivate" class="w3-bar-item w3-button">Private</button>
    <button @click="createPrivate" class="w3-bar-item w3-button">Create Private</button>
    <button @click="feedback" class="w3-bar-item w3-button">Feedback</button>
    <button @click="info" class="w3-bar-item w3-button">Info</button>
    <button @click="logout" class="w3-bar-item w3-button">Log out</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";
import { Routes } from "../router";

export default Vue.extend({
  /**
   * The only data needed by this component is a reference to the parent's state
   */
  data(): any {
    return { state: (this.$parent as any).state as AppState };
  },
  methods: {
    /**
     * Clicking "Public" shows all the public messages.  There's one trick,
     * though. If we're on "Public" and click "Public", we need a refresh.
     * Getting refresh to work is brittle right now, because it assumes that
     * <router-link> is the fourth component in App.vue.
     */
    allPublic() {
      if (this.$router.currentRoute.path === Routes.readAllPublic) {
        (this.$parent.$children[3] as any).load();
      } else {
        this.$router.replace(Routes.readAllPublic);
      }
    },

    /** Navigate to the page for creating a public message. */
    createPublic() {
      this.$router.replace(Routes.createPublic);
    },

    /**
     * Clicking "Private" shows all the public messages.  There's one trick,
     * though. If we're on "Private" and click "Private", we need a refresh.
     * Getting refresh to work is brittle right now, because it assumes that
     * <router-link> is the fourth component in App.vue.
     */
    allPrivate() {
      if (
        this.$router.currentRoute.path ===
        Routes.readAllPrivate + "/" + this.$parent.state.user.token
      ) {
        (this.$parent.$children[3] as any).load();
      } else {
        this.$router.replace(
          Routes.readAllPrivate + "/" + this.$parent.state.user.token
        );
      }
    },

    /** Navigate to the page for creating a private message. */
    createPrivate() {
      this.$router.replace(Routes.createPrivate);
    },

    /**
     * Show a pop-up with information (name, admin status) about the logged-in
     * user.
     */
    info() {
      let state: AppState = (this.$parent as any).state;
      state.infoShow(
        "The current user is:" +
          state.user.name +
          (state.user.isAdmin ? " (admin)" : "")
      );
    },

    /** Log out the current user */
    logout() {
      let state: AppState = (this.$parent as any).state;
      state.logOut();
    },

    /** Navigate to the page for creating and viewing feedback */
    feedback() {
      let suffix = this.$parent.state.user.isAdmin ? "/view" : "/create";
      this.$router.replace(Routes.feedback + suffix);
    }
  }
});
</script>