// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import "firebase/auth";
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApI8TBUiAyjWEUFWye5LZ8WjVA1LFSfaM",
  authDomain: "chat-712d9.firebaseapp.com",
  projectId: "chat-712d9",
  storageBucket: "chat-712d9.appspot.com",
  messagingSenderId: "331439033949",
  appId: "1:331439033949:web:90b5942484302d447047b4",
  measurementId: "G-1VFQ6ZGD0P",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
// const analytics = getAnalytics(app);
var authFire = firebase.auth();

var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
export { authFire, provider, database, storage };
