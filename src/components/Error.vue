<!-- 
  Error.vue is a pop-up window for displaying an error message.
  -->
<template>
  <div v-if="state.error.show" style="display:block" class="w3-modal">
    <div class="w3-modal-content">
      <h2 class="w3-red">&nbsp;Error</h2>
      <div class="w3-container">
        <span @click="clear" class="w3-button w3-display-topright">&times;</span>
        <p>{{state.error.msg}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppState from "../appstate";

export default Vue.extend({
  /**
   * The only data needed by this component is a reference to the parent's state
   */
  data(): any {
    return { state: (this.$parent as any).state as AppState };
  },
  methods: {
    /** When the "X" is clicked, ask AppState to hide this pop-up */
    clear() {
      this.state.errorClear();
    }
  }
});
</script>