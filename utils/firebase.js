import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

// import {fire} from 'firebase';
// import 'firebase/auth';
// import 'firebase/firestore';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDrDVAF8y8lr2SHRx6QL7UwXQd1Yuck8CQ",
    authDomain: "moneybook-cddaf.firebaseapp.com",
    databaseURL: "https://moneybook-cddaf.firebaseio.com",
    projectId: "moneybook-cddaf",
    storageBucket: "moneybook-cddaf.appspot.com",
    messagingSenderId: "122077792070"
};
firebase.initializeApp(config);


const db = firebase.firestore();
export {firebase, db};