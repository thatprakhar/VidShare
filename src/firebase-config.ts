import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDCRz8T4B3b1mKQQixpbameuAmsk2Wx1Ac",
    authDomain: "song-share-19aae.firebaseapp.com",
    projectId: "song-share-19aae",
    storageBucket: "song-share-19aae.appspot.com",
    messagingSenderId: "724604204142",
    appId: "1:724604204142:web:0b32db5f695f2c8f54227f",
    measurementId: "G-YZSSKDGS1E",
    databaseURL: ''
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const firebaseStorage = firebase.storage();
export default firebaseConfig;