import { createRouter, createWebHistory } from 'vue-router'
import ReadAllPublic from '@/components/ReadAllPublic.vue'
import ReadOnePublic from '@/components/ReadOnePublic.vue'
import CreatePublic from '@/components/CreatePublic.vue'
import ReadAllPrivate from '@/components/ReadAllPrivate.vue'
import ReadOnePrivate from '@/components/ReadOnePrivate.vue'
import CreatePrivate from '@/components/CreatePrivate.vue'
import Feedback from '@/components/Feedback.vue'
import LogIn from '@/components/LogIn.vue';

export const Routes = {
  logIn: "/",
  createPublic: "/create",
  readAllPublic: "/readall",
  readOnePublic: "/readone",
  createPrivate: "/private/create",
  readAllPrivate: "/private/readall",
  readOnePrivate: "/private/readone",
  feedback: "/feedback"
};

export const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Default (/) is the log-in page.  Any time the user gets logged out,
    // we'll redirect to here.
    { path: Routes.logIn, name: "LogIn", component: LogIn },

    // Navigating to (/create) allows the user to create a new public
    // document
    { path: Routes.createPublic, name: "CreatePublic", component: CreatePublic },

    // Navigating to (/readall) gives a listing of all public documents.
    // When the user logs in, we'll redirect to here.
    { path: Routes.readAllPublic, name: "ReadAllPublic", component: ReadAllPublic },

    // Navigating to (/readone/xxxxx) will show everything about document
    // xxxxx.  It will also be possible to edit the document, if the user is
    // the owner of the document.
    { path: Routes.readOnePublic + '/:id', name: "ReadOnePublic", component: ReadOnePublic, props: true },

    // Navigating to (/private/create) allows the user to create a new
    // private document
    { path: Routes.createPrivate, name: "CreatePrivate", component: CreatePrivate },

    // Navigating to (/private/readall/uuuuu) gives a listing of all private
    // documents for user uuuuu.
    { path: Routes.readAllPrivate + '/:userid', name: "ReadAllPrivate", component: ReadAllPrivate, props: true },

    // Navigating to (/private/readone/uuuuu/xxxxx) will show everything
    // about private document xxxxx from user uuuuu.  It will also be
    // possible to edit the document.
    { path: Routes.readOnePrivate + '/:userid/:docid', name: "ReadOnePrivate", component: ReadOnePrivate, props: true },

    // Navigating to (/feedback) will let non-admins enter feedback, and
    // admins view feedback.
    { path: Routes.feedback + "/:mode", name: "Feedback", component: Feedback, props: true }]
});