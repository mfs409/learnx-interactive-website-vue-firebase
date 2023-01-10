// main.ts is the entry point into our program.  Since we are using the Vue
// framework, the only purpose of this file is to set up Vue and connect the
// parts of our program to it.

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'w3-css/w3.css';

import { Router } from '@/router'
import { initialCheckLogin } from './appstate';
import App from '@/components/App.vue'

// Indicate that "App.vue" is the main component of our web app
const app = createApp(App)

// Set up the app to use pinia for global state management, and the router we
// define in ./router
app.use(createPinia())
app.use(Router)

// Put our app into the web page inside the div with id == "app"
app.mount('#app')

// Check if we're already logged in from the last time the page was visited
initialCheckLogin()
