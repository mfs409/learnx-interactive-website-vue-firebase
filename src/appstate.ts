// AppState is the most complex part of our program.  Since we are using Vue, we
// need to think of our program as a collection of loosely-coupled "components".
// These components need to share information and common code.  The way we share
// is by putting all of the shareable information and code into AppState,
// assigning *one* AppState to the main component (App.vue), and then letting
// the other components, which are children of App.vue, use their parent's
// AppState.

import Router from 'vue-router'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import config from "./config";
import { Routes } from "./router";

/**
 * TODO: remove this comment once the last parts are done
 * 
 * The data model will look like this:
 * /public/{Id} will be for storing public entries
 *   -- an entry consists of subject, message, creator, timestamp
 * /files/{userId}/ids/{Id} will be for storing the IDs of a user's files
 *   -- an entry consists of an ID, and that's it
 * /private/{userId}/privatedocs/{Id} will be for storing private entries
 *   -- an entry consists of subject, message, file, creator, timestamp, and state
 *   -- state is either "temp" or "done"
 * /admin/{Id} will be for storing the UserIds of administrators
 *   -- Just a userid, that's it
 * /feedback/{Id} will be for storing feedback from users
 *   -- an entry consists of creator, timestamp, and message
 *
 * Status
 * /feedback isn't set up, but permissions are
 */

export default class AppState {
    /** The firebase cloud firestore "database" object */
    private db: firebase.firestore.Firestore = null;
    /** The firebase authentication module */
    private auth: firebase.auth.Auth = null;
    /** Google authentication support for firebase auth */
    private authProvider: firebase.auth.GoogleAuthProvider = null;
    /** The firebase storage module */
    private storage: firebase.storage.Storage = null;

    /** All information about the current user */
    public user = { loggedIn: false, name: "", token: "", isAdmin: false };

    /** Support for info pop-ups */
    public info = { show: false, msg: "" };

    /** Support for error pop-ups */
    public error = { show: false, msg: "" };

    /** The names of the top-level documents in the database */
    private readonly docs = {
        pub: "/public",
        priv: "/private",
        privsub: "/docs",
        fileid: "/files",
        filesub: "/ids",
        admin: "/admin",
        feedback: "/feedback"
    };

    /** The names of the important folders in Firebase Storage */
    private readonly folders = {
        pub: "/images",
        priv: "/private"
    };

    /**
     * Construct the state object for this app
     * 
     * @param router The router used by this app
     */
    constructor(private router: Router) {
        // Initialize firebase using our configuration
        let fb = firebase.initializeApp(config);
        // get firebase cloud firestore (database)
        this.db = fb.firestore();
        this.db.settings({ timestampsInSnapshots: true });
        // get firebase storage
        this.storage = fb.storage();
        // get firebase authentication
        this.auth = fb.auth();
        this.authProvider = new firebase.auth.GoogleAuthProvider();
        // Check to see if the user is still logged in from a previous session
        this.initialCheckLogin();
    }

    /**
     * Create a feedback posting
     * 
     * @param message The message to post to feedback
     * @param success Code to run if the feedback is successfully created
     * @param failure Code to run if the feedback cannot be made
     */
    public createFeedback(message: string, success: () => void, failure: (error: any) => void) {
        this.db.collection(this.docs.feedback).add({
            creator: this.user.token,
            message: message,
            timestamp: firebase.firestore.Timestamp.now()
        }).then(() => success()).catch((error) => failure(error));
    }

    /**
     * Get all of the feedback documents
     *
     * @param callback The code to run once the document has been fetched
     */
    public readallFeedback(callback: (r: any) => void) {
        this.db.collection(this.docs.feedback).get()
            .then((data) => {
                let res: any = [];
                data.forEach((doc) => {
                    res.push({
                        id: doc.id, message: doc.data().message,
                        creator: doc.data().creator, timestamp: doc.data().timestamp
                    })
                });
                callback(res);
            }).catch((error) => {
                this.errorShow("Error retrieving documents: " + error)
            });
    }

    /**
     * Get a unique identifier to use as the name of a to-be-created file
     *
     * @param success code to run if a unique id is generated
     * @param failure code to run if there is an error
     */
    public getFileId(success: (id: string) => void, failure: (error: any) => void) {
        this.db.collection(this.docs.fileid + "/" + this.user.token + this.docs.filesub).add({})
            .then((docRef) => success(docRef.id))
            .catch((error) => failure(error));
    }

    /**
     * Create a new public posting
     * 
     * @param fileId The id of the file that is part of this posting
     * @param subject The subject of this posting
     * @param message The message
     * @param success Code to run if the posting is successfully created
     * @param failure Code to run if the posting cannot be made
     */
    public createPublicDoc(fileId: string, subject: string, message: string, success: () => void, failure: (error: any) => void) {
        this.db.collection(this.docs.pub).add({
            fileId: fileId,
            creator: this.user.token,
            subject: subject,
            message: message,
            timestamp: firebase.firestore.Timestamp.now()
        }).then(() => success()).catch((error) => failure(error));
    }

    /**
     * Create a new private posting
     * 
     * @param fileId The id of the file that is part of this posting
     * @param subject The subject of this posting
     * @param message The message
     * @param success Code to run if the posting is successfully created
     * @param failure Code to run if the posting cannot be made
     */
    public createPrivateDoc(fileId: string, subject: string, message: string, success: () => void, failure: (error: any) => void) {
        this.db.collection(this.docs.priv + "/" + this.user.token + this.docs.privsub).add({
            fileId: fileId,
            creator: this.user.token,
            subject: subject,
            message: message,
            timestamp: firebase.firestore.Timestamp.now()
        }).then(() => success()).catch((error) => failure(error));
    }

    /**
     * Get a public document and pass its contents to a callback
     * 
     * @param id The id of the document to read
     * @param callback The code to run once the document has been fetched
     */
    public readonePublicDoc(id: string, callback: (r: any) => void) {
        this.db.collection(this.docs.pub).doc(id).get()
            .then((doc) => {
                let d = doc.data();
                callback({
                    id: doc.id, subject: d.subject, message: d.message,
                    timestamp: d.timestamp, fileId: d.fileId, creator: d.creator
                });
            }).catch((error) => {
                this.errorShow("Error retrieving document: " + error)
            });
    }

    /**
     * Get a private document and pass its contents to a callback
     * 
     * @param userId: The id of the user whose private document is being read
     * @param docid The id of the document to read
     * @param callback The code to run once the document has been fetched
     */
    public readonePrivateDoc(userId: string, docid: string, callback: (r: any) => void) {
        this.db.collection(this.docs.priv + "/" + userId + this.docs.privsub).doc(docid).get()
            .then((doc) => {
                let d = doc.data();
                callback({
                    id: doc.id, subject: d.subject, message: d.message,
                    timestamp: d.timestamp, fileId: d.fileId, creator: d.creator
                });
            }).catch((error) => {
                this.errorShow("Error retrieving document: " + error)
            });
    }

    /**
     * Get all of the public documents and pass their id/subject fields to a
     * callback.
     *
     * @param callback The code to run once the document has been fetched
     */
    public readallPublicDoc(callback: (r: any) => void) {
        this.db.collection(this.docs.pub).get()
            .then((data) => {
                let res: any = [];
                data.forEach((doc) => {
                    res.push({ id: doc.id, subject: doc.data().subject })
                });
                callback(res);
            }).catch((error) => {
                this.errorShow("Error retrieving documents: " + error)
            });
    }

    /**
     * Get all of the private documents and pass their id/subject fields to a
     * callback.
     *
     * @param userId The id of the user whose private docs are being shown
     * @param callback The code to run once the document has been fetched
     */
    public readallPrivateDoc(userId: string, callback: (r: any) => void) {
        this.db.collection(this.docs.priv + "/" + userId + this.docs.privsub).get()
            .then((data) => {
                let res: any = [];
                data.forEach((doc) => {
                    res.push({ id: doc.id, subject: doc.data().subject })
                });
                callback(res);
            }).catch((error) => {
                this.errorShow("Error retrieving documents: " + error)
            });
    }

    /**
     * Update the subject and message for a public document
     * 
     * @param id The id of the document to update
     * @param subject The new subject for the document
     * @param message The new message for the document
     */
    public updatePublicDoc(id: string, subject: string, message: string) {
        this.db.collection(this.docs.pub).doc(id).update({
            subject: subject, message: message
        }).then(() => {
            this.infoShow("Document successfully updated!");
        }).catch((error) => {
            this.errorShow("Error updating document: " + error);
        });
    }

    /**
     * Update the subject and message for a private document
     * 
     * @param id The id of the document to update
     * @param subject The new subject for the document
     * @param message The new message for the document
     */
    public updatePrivateDoc(id: string, subject: string, message: string) {
        this.db.collection(this.docs.priv + "/" + this.user.token + this.docs.privsub).doc(id).update({
            subject: subject, message: message
        }).then(() => {
            this.infoShow("Document successfully updated!");
        }).catch((error) => {
            this.errorShow("Error updating document: " + error);
        });
    }

    /**
     * Delete a public document
     * 
     * @param id The ID of the document to delete
     * @param callback The code to run after the document is deleted
     */
    public deletePublicDoc(id: string, callback: () => void) {
        this.db.collection(this.docs.pub).doc(id).delete()
            .then(() => {
                callback();
            }).catch((error) => {
                this.errorShow("Error removing document: " + error);
            });
    }

    /**
     * Delete a private document
     * 
     * @param id The ID of the document to delete
     * @param callback The code to run after the document is deleted
     */
    public deletePrivateDoc(id: string, callback: () => void) {
        this.db.collection(this.docs.priv + "/" + this.user.token + this.docs.privsub).doc(id).delete()
            .then(() => {
                callback();
            }).catch((error) => {
                this.errorShow("Error removing document: " + error);
            });
    }

    /**
     * Show an error pop-up
     * 
     * @param message The message to display
     */
    public errorShow(message: string) {
        this.error.msg = message;
        this.error.show = true;
    }

    /** Hide the error pop-up */
    public errorClear() {
        this.error.msg = "";
        this.error.show = false;
    }

    /**
     * Show an informational pop-up
     * 
     * @param message The message to display
     */
    public infoShow(message: string) {
        this.info.msg = message;
        this.info.show = true;
    }

    /** Hide the informational pop-up */
    public infoClear() {
        this.info.msg = "";
        this.info.show = false;
    }

    /**
     * Check to see if the user is logged in.  Note that the firebase
     * documentation recommends a more complex approach, using
     * getRedirectResult().  Our simpler approach is probably sufficient, since
     * we aren't using any extra Google services.
     */
    private initialCheckLogin() {
        // Specify code that should run any time the user logs in or out
        this.auth.onAuthStateChanged(() => {
            if (!this.auth.currentUser) {
                // If nobody is logged in, clear user fields and redirect to '/'
                this.user.loggedIn = false;
                this.user.name = "";
                this.user.token = "";
                this.user.isAdmin = false;
                this.router.replace(Routes.logIn);
            }
            else {
                // If someone is logged in, save the name and login token
                this.user.loggedIn = true;
                this.user.name = this.auth.currentUser.displayName;
                this.user.token = this.auth.currentUser.uid;
                // Check if the user is an administrator
                this.getAdminState();
                // If the "log in" page is showing ('/'), redirect to '/readall'
                // Note that we are using "Routes.logIn" instead of "/", and
                // "Routes.readAllPublic" instead of "/readall", so that typos
                // don't break the code.
                if (this.router.currentRoute.fullPath === Routes.logIn)
                    this.router.replace(Routes.readAllPublic);
            }
        });
    }

    /**
     * Determine whether the current user is an administrator or not, by seeing
     * if there Id is a document in the admin table
     */
    private getAdminState() {
        this.db.collection(this.docs.admin).doc(this.user.token).get()
            .then((doc: any) => this.user.isAdmin = doc.exists)
            .catch((error) => { console.log(error) });
    }

    /** Log out the current user, and redirect to '/' */
    public logOut() {
        this.auth.signOut().then(() => { this.router.replace(Routes.logIn) });
        this.user.loggedIn = false;
        this.user.name = this.user.token = "";
    }

    /** Start a log-in flow by redirecting to Google */
    public logIn() {
        this.auth.signInWithRedirect(this.authProvider).then(() => { });
    }

    /**
     * Upload a public image to firebase.  This starts a long-running upload
     * task, and returns a firebase UploadTask object, so that the caller can
     * monitor the progress of the upload.
     *
     * @param id The id to use as the name of the file
     * @param file The file object that should get sent to firebase storage
     * @param metadata The metadata (such as content-type) for the file
     */
    public uploadPublicImage(id: string, file: any, metadata: any) {
        return this.storage.ref().child(this.folders.pub + "/" + id).put(file, metadata);
    }

    /**
     * Upload a private image to firebase.  This starts a long-running upload
     * task, and returns a firebase UploadTask object, so that the caller can
     * monitor the progress of the upload.
     *
     * @param id The id to use as the name of the file
     * @param file The file object that should get sent to firebase storage
     * @param metadata The metadata (such as content-type) for the file
     */
    public uploadPrivateImage(id: string, file: any, metadata: any) {
        return this.storage.ref().child(this.folders.priv + "/" + this.user.token + "/" + id).put(file, metadata);
    }

    /**
     * Get the Url that corresponds to a public fileId.  This starts an
     * asynchronous task, so we return the task (actually a Promise) so that the
     * caller can wait for it to finish, and then get the Url.
     *
     * @param id The id of the file, which is the filename
     */
    public getPublicFileUrl(id: string) {
        return this.storage.ref(this.folders.pub + "/" + id).getDownloadURL()
    }

    /**
     * Get the Url that corresponds to a private fileId.  This starts an
     * asynchronous task, so we return the task (actually a Promise) so that the
     * caller can wait for it to finish, and then get the Url.
     *
     * @param id The id of the file, which is the filename
     */
    public getPrivateFileUrl(id: string) {
        return this.storage.ref(this.folders.priv + "/" + this.user.token + "/" + id).getDownloadURL()
    }
}