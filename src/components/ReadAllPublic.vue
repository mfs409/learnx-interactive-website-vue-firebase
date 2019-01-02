<!-- 
  ReadAllPublic.vue lists all of the public messages.  It only shows the
  subjects. Clicking a row will lead to the rest of the information being shown.
  -->
<template>
  <div>
    <ul class="w3-ul w3-border">
      <li>
        <h2>Public Messages</h2>
      </li>
      <li
        @click="click(elt.id)"
        class="w3-hover-blue"
        v-for="elt in mydata"
        :key="elt.id"
      >{{ elt.subject }}</li>
      <li>As of {{ when }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";
import { Routes } from "../router";

export default Vue.extend({
  /**
   * The data for this Component consists of 'mydata', which holds all the
   * results from firebase, and 'when', which gives the time when we got data
   * from firebase.
   */
  data(): any {
    return { mydata: [], when: "updating..." };
  },
  methods: {
    /** Clicking a row should take us to the details page for that row */
    click(id: string) {
      this.$router.replace(Routes.readOnePublic + "/" + id);
    },

    /** Common code to get data from firebase */
    load() {
      let state: AppState = (this.$parent as any).state;
      state.readallPublicDoc((res: any) => {
        this.mydata = res;
        this.when = new Date().toString();
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