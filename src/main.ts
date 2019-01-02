// main.ts is the entry point into our program.  Since we are using the Vue
// framework, the only purpose of this file is to set up Vue and connect the
// parts of our program to it.

import Vue from "vue";
import 'w3-css/w3.css';
import router from './router';
import AppState from "./appstate";
import AppComponent from './components/App.vue';

// Hide the production vs. developer note for Vue
Vue.config.productionTip = false;

new Vue({
    // The identity of the main <div> in index.html 
    el: "#app",
    // The "router"... see ./router.ts
    router,
    // The component to put into #app is the one we imported as AppComponent
    components: { AppComponent },
    // When we create AppComponent, it will need an AppState object for storing
    // all of the global application state.
    data: { state: new AppState(router) },
    // This line actually puts the AppComponent into the web page, and connects
    // it to the AppState.
    template: '<AppComponent :state="state" />'
}).$mount('#app');