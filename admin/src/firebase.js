import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.APP_KEY,
  authDomain: "netflix-clone-2783b.firebaseapp.com",
  projectId: "netflix-clone-2783b",
  storageBucket: "netflix-clone-2783b.appspot.com",
  messagingSenderId: "215864769418",
  appId: "1:215864769418:web:9d1792cc4c430afe7ae673",
  measurementId: "G-BPNXY0HMNQ"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
