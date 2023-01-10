import { defineStore } from "pinia";

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, addDoc, Timestamp, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore/lite";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

import { config } from '@/fbconfig'
import { Routes, Router } from "@/router";

/** The names of the top-level documents in the database */
const docs = {
    pub: "/public",
    priv: "/private",
    privsub: "/docs",
    admin: "/admin",
    fileid: "/files",
    filesub: "/ids",
    feedback: "/feedback",
} as const;

/** The names of the important folders in Firebase Storage */
const folders = {
    pub: "/images",
    priv: "/private",
} as const;

export const appState = defineStore({
    id: "appState",
    state: () => ({
        /** Support for info pop-ups */
        info: { show: false, msg: "" },

        /** Support for error pop-ups */
        error: { show: false, msg: "" },

        /** Access to Firebase */
        fb: initializeApp(config),

        /** The firebase authentication module */
        auth: getAuth(),// undefined as firebase.auth.Auth | undefined,

        /** Google authentication support for firebase auth */
        authProvider: new GoogleAuthProvider(),

        /** All information about the current user */
        user: { loggedIn: false, name: "", token: "", isAdmin: false },

        /** Storage */
        storage: getStorage()

    }),
    actions: {
        /**
         * Show an informational pop-up
         * 
         * @param message The message to display
         */
        infoShow(message: string) {
            this.info.msg = message;
            this.info.show = true;
        },

        /** Hide the informational pop-up */
        infoClear() {
            this.info.msg = "";
            this.info.show = false;
        },

        /**
         * Show an error pop-up
         * 
         * @param message The message to display
         */
        errorShow(message: string) {
            this.error.msg = message;
            this.error.show = true;
        },

        /** Hide the error pop-up */
        errorClear() {
            this.error.msg = "";
            this.error.show = false;
        },

        /** Log out the current user, and redirect to '/' */
        logOut() {
            this.auth.signOut().then(() => { Router.replace(Routes.logIn) });
            this.user.loggedIn = false;
            this.user.name = this.user.token = "";
        },

        /** Start a log-in flow by redirecting to Google */
        async logIn() {
            await signInWithRedirect(this.auth, this.authProvider).then(() => { });
        },

        /**
         * Determine whether the current user is an administrator or not, by seeing
         * if there Id is a document in the admin table
         */
        getAdminState() {
            if (!this.user.token) {
                this.user.isAdmin = false;
                return;
            }
            let docRef = doc(getFirestore(), docs.admin, this.user.token);
            getDoc(docRef)
                .then((doc: any) => {
                    this.user.isAdmin = doc.exists()
                })
                .catch((error) => { console.log(error) })
        },

        /**
         * Create a new public posting
         * 
         * @param fileId  The Id of the file, which should have been created already
         * @param subject The subject of this posting
         * @param message The message
         * @param success Code to run if the posting is successfully created
         * @param failure Code to run if the posting cannot be made
         */
        createPublicDoc(fileId: string, subject: string, message: string, success: () => void, failure: (e: any) => void) {
            let c = collection(getFirestore(), docs.pub);
            addDoc(c, {
                creator: this.user.token,
                subject: subject,
                fileId: fileId,
                message: message,
                timestamp: Timestamp.fromMillis(Date.now())
            }).then(success).catch(failure);
        },

        /**
         * Get all of the public documents and pass their id/subject fields to a
         * callback.
         *
         * @param callback The code to run once the document has been fetched
         */
        async readallPublicDoc(callback: (r: any) => void) {
            let c = collection(getFirestore(), docs.pub);
            let data = await getDocs(c);
            let res: any = [];
            data.forEach((doc) => {
                res.push({ id: doc.id, subject: doc.data().subject })
            });
            callback(res);
        },

        /**
         * Get a public document and pass its contents to a callback
         * 
         * @param id The id of the document to read
         * @param callback The code to run once the document has been fetched
         */
        async readonePublicDoc(id: string, callback: (r: any) => void) {
            let docRef = doc(getFirestore(), docs.pub, id);
            let data = await getDoc(docRef)
            let d = data.data()!;
            callback({
                id: data.id, subject: d.subject, message: d.message,
                fileId: d.fileId,
                timestamp: d.timestamp, creator: d.creator
            });
        },

        /**
         * Update the subject and message for a public document
         * 
         * @param id The id of the document to update
         * @param subject The new subject for the document
         * @param message The new message for the document
         */
        updatePublicDoc(id: string, subject: string, message: string) {
            const docRef = doc(getFirestore(), docs.pub, id);
            updateDoc(docRef, {
                subject: subject, message: message
            }).then(() => {
                this.infoShow("Document successfully updated!");
            }).catch((error) => {
                this.errorShow("Error updating document: " + error);
            });
        },

        /**
         * Delete a public document
         * 
         * @param id The ID of the document to delete
         * @param callback The code to run after the document is deleted
         */
        deletePublicDoc(id: string, callback: () => void) {
            deleteDoc(doc(getFirestore(), docs.pub, id))
                .then(() => {
                    callback();
                }).catch((error) => {
                    this.errorShow("Error removing document: " + error);
                });
        },

        /**
         * Create a new private posting
         * 
         * @param fileId The id of the file that is part of this posting
         * @param subject The subject of this posting
         * @param message The message
         * @param success Code to run if the posting is successfully created
         * @param failure Code to run if the posting cannot be made
         */
        createPrivateDoc(fileId: string, subject: string, message: string, success: () => void, failure: (error: any) => void) {
            let c = collection(getFirestore(), docs.priv + "/" + this.user.token + docs.privsub);
            addDoc(c, {
                creator: this.user.token,
                subject: subject,
                fileId: fileId,
                message: message,
                timestamp: Timestamp.fromMillis(Date.now())
            }).then(success).catch(failure);
        },

        /**
         * Get all of the private documents and pass their id/subject fields to a
         * callback.
         *
         * @param userId The id of the user whose private docs are being shown
         * @param callback The code to run once the document has been fetched
         */
        async readallPrivateDoc(userId: string, callback: (r: any) => void) {
            let c = collection(getFirestore(), docs.priv + "/" + userId + docs.privsub);
            let data = await getDocs(c);
            let res: any = [];
            data.forEach(doc => {
                res.push({ id: doc.id, subject: doc.data().subject })
            })
            callback(res);
        },

        /**
         * Get a private document and pass its contents to a callback
         * 
         * @param userId: The id of the user whose private document is being read
         * @param docid The id of the document to read
         * @param callback The code to run once the document has been fetched
         */
        async readonePrivateDoc(userId: string, docid: string, callback: (r: any) => void) {
            let docRef = doc(getFirestore(), docs.priv + "/" + userId + docs.privsub, docid);
            let data = await getDoc(docRef);
            let d = data.data()!;
            callback({
                id: data.id, subject: d.subject, message: d.message,
                timestamp: d.timestamp, fileId: d.fileId, creator: d.creator
            });
        },

        /**
         * Update the subject and message for a private document
         * 
         * @param user The id of the user whose doc is being updated
         * @param id The id of the document to update
         * @param subject The new subject for the document
         * @param message The new message for the document
         */
        updatePrivateDoc(user: string, id: string, subject: string, message: string) {
            const docRef = doc(getFirestore(), docs.priv + "/" + user + docs.privsub, id)
            updateDoc(docRef, {
                subject: subject, message: message
            }).then(() => {
                this.infoShow("Document successfully updated!");
            }).catch((error) => {
                this.errorShow("Error updating document: " + error);
            });
        },

        /**
         * Delete a private document
         * 
         * @param user The id of the user whose doc is being updated
         * @param id The ID of the document to delete
         * @param callback The code to run after the document is deleted
         */
        deletePrivateDoc(user: string, id: string, callback: () => void) {
            deleteDoc(doc(getFirestore(), docs.priv + "/" + user + docs.privsub, id))
                .then(() => {
                    callback();
                }).catch((error) => {
                    this.errorShow("Error removing document: " + error);
                });
        },

        /**
         * Get a unique identifier to use as the name of a to-be-created file
         *
         * @param success code to run if a unique id is generated
         * @param failure code to run if there is an error
         */
        getFileId(success: (id: string) => void, failure: (error: any) => void) {
            let c = collection(getFirestore(), docs.fileid + "/" + this.user.token + docs.filesub);
            addDoc(c, {})
                .then((docRef) => success(docRef.id))
                .catch((error) => failure(error));
        },

        /**
         * Upload a public image to firebase.  This starts a long-running upload
         * task, and returns a firebase UploadTask object, so that the caller can
         * monitor the progress of the upload.
         *
         * @param id The id to use as the name of the file
         * @param file The file object that should get sent to firebase storage
         * @param metadata The metadata (such as content-type) for the file
         */
        uploadPublicImage(id: string, file: any, metadata: any) {
            let r = ref(this.storage, folders.pub + "/" + id);
            return uploadBytesResumable(r, file, metadata);
        },

        /**
         * Get the Url that corresponds to a public fileId.  This starts an
         * asynchronous task, so we return the task (actually a Promise) so that the
         * caller can wait for it to finish, and then get the Url.
         *
         * @param id The id of the file, which is the filename
         */
        getPublicFileUrl(id: string) {
            let r = ref(getStorage(), folders.pub + "/" + id);
            return getDownloadURL(r);
        },

        /**
         * Upload a private image to firebase.  This starts a long-running upload
         * task, and returns a firebase UploadTask object, so that the caller can
         * monitor the progress of the upload.
         *
         * @param id The id to use as the name of the file
         * @param file The file object that should get sent to firebase storage
         * @param metadata The metadata (such as content-type) for the file
         */
        uploadPrivateImage(id: string, file: any, metadata: any) {
            let r = ref(this.storage, folders.priv + "/" + this.user.token + "/" + id);
            return uploadBytesResumable(r, file, metadata);
        },

        /**
         * Get the Url that corresponds to a private fileId.  This starts an
         * asynchronous task, so we return the task (actually a Promise) so that the
         * caller can wait for it to finish, and then get the Url.
         *
         * @param id The id of the file, which is the filename
         */
        getPrivateFileUrl(id: string) {
            let r = ref(getStorage(), folders.priv + "/" + this.user.token + "/" + id);
            return getDownloadURL(r);
        },

        /**
         * Create a feedback posting
         * 
         * @param message The message to post to feedback
         * @param success Code to run if the feedback is successfully created
         * @param failure Code to run if the feedback cannot be made
         */
        createFeedback(message: string, success: () => void, failure: (error: any) => void) {
            let c = collection(getFirestore(), docs.feedback);
            addDoc(c, {
                creator: this.user.token,
                message: message,
                timestamp: Timestamp.fromMillis(Date.now())
            }).then(success).catch(failure);
        },

        /**
         * Get all of the feedback documents
         *
         * @param callback The code to run once the document has been fetched
         */
        async readallFeedback(callback: (r: any) => void) {
            let c = collection(getFirestore(), docs.feedback);
            let data = await getDocs(c);
            let res: any = [];
            data.forEach((doc) => res.push({
                id: doc.id, message: doc.data().message,
                creator: doc.data().creator, timestamp: doc.data().timestamp
            }));
            callback(res);
        },
    }
});

/**
 * Check to see if the user is logged in.  Note that the firebase
 * documentation recommends a more complex approach, using
 * getRedirectResult().  Our simpler approach is probably sufficient, since
 * we aren't using any extra Google services.
 */
export function initialCheckLogin() {
    let auth = appState().auth;
    let user = appState().user;
    appState().getAdminState();
    // Specify code that should run any time the user logs in or out
    auth.onAuthStateChanged(() => {
        if (!auth.currentUser) {
            // If nobody is logged in, clear user fields and redirect to '/'
            user.loggedIn = false;
            user.name = "";
            user.token = "";
            user.isAdmin = false;
            Router.replace(Routes.logIn);
        }
        else {
            // If someone is logged in, save the name and login token
            user.loggedIn = true;
            user.name = auth.currentUser.displayName + "";
            user.token = auth.currentUser.uid;
            appState().getAdminState();
            // If the "log in" page is showing ('/'), redirect to '/readall'
            // Note that we are using "Routes.logIn" instead of "/", and
            // "Routes.readAllPublic" instead of "/readall", so that typos
            // don't break the code.
            if (Router.currentRoute.value.path === Routes.logIn)
                Router.replace(Routes.readAllPublic);
        }
    });
}