/*import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database'; // Add this line to import the database module

var firebaseConfig = {
  apiKey: "AIzaSyBFxijAY3GWQzdf_JiFJUO2vzhAYkyfHCM",
  authDomain: "beatbounceandscore.firebaseapp.com",
  databaseURL: "https://beatbounceandscore-default-rtdb.firebaseio.com/",
  projectId: "beatbounceandscore",
  storageBucket: "beatbounceandscore.appspot.com",
  messagingSenderId: "835810414015",
  appId: "1:835810414015:web:4f70baffce68f4696ea50a",
  measurementId: "G-740SECVD5V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

var firepadRef = firebase.database().ref();


const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  firepadRef = firepadRef.child(roomId);
} else {
  firepadRef = firepadRef.push();
  window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
}

export default firepadRef;
*/