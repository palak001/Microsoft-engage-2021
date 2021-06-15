import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config";

const Firebase = firebase.initializeApp(config.firebase);

// Authentication method
export const Providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = Firebase.auth();
export const db = firebase.firestore();
export default Firebase;
