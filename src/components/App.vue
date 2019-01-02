<!-- 
  App.vue is the main component of our app.  It is just a holder for a few
  things:
    - The AppState object
    - A Menu component
    - Components for showing Error and Info pop-up messages
    - A Router-View for showing the main content of the app
  -->
<template>
  <div id="app">
    <menu-component name="menu"/>
    <error-component name="error"/>
    <info-component name="info"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MenuComponent from "./Menu.vue";
import InfoComponent from "./Info.vue";
import ErrorComponent from "./Error.vue";

export default Vue.extend({
  /** indicate that this Component needs an AppState when it is created */
  props: ["state"],
  name: "app",
  components: { MenuComponent, ErrorComponent, InfoComponent }
});
</script>