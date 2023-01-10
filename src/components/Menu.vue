<script setup lang="ts">

import { appState } from "@/appstate";
import { Routes } from "@/router";
import { Router } from "@/router";

let state = appState()

/**
 * Clicking "Public" shows all the public messages. There's one trick,
 * though. If we're on "Public" and click "Public", we need a refresh.
 * Getting refresh to work is brittle right now, because it assumes that
 * <router-link> is the fourth component in App.vue.
 */
function allPublic() {
    if (Router.currentRoute.value.path == Routes.readAllPublic)
        Router.go(0);
    else
        Router.replace(Routes.readAllPublic);
}

/** Navigate to the page for creating a public message. */
function createPublic() {
    Router.replace(Routes.createPublic);
}

/**
 * Show a pop-up with information (name, admin status) about the logged-in
 * user.
 */
function info() {
    state.infoShow(
        "The current user is:" +
        state.user.name +
        (state.user.isAdmin ? " (admin)" : "")
    );
}

/** Log out the current user */
function logout() {
    state.logOut();
}

/**
 * Clicking "Private" shows all the public messages.  There's one trick,
 * though. If we're on "Private" and click "Private", we need a refresh.
 * Getting refresh to work is brittle right now, because it assumes that
 * <router-link> is the fourth component in App.vue.
 */
function allPrivate() {
    if (Router.currentRoute.value.path == Routes.readAllPrivate + "/" + state.user.token)
        Router.go(0);
    else
        Router.replace(Routes.readAllPrivate + "/" + state.user.token);
}

/** Navigate to the page for creating a private message. */
function createPrivate() {
    Router.replace(Routes.createPrivate);
}

/** Navigate to the page for creating and viewing feedback */
function feedback() {
    let suffix = state.user.isAdmin ? "/view" : "/create";
    Router.replace(Routes.feedback + suffix);
}

</script>

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