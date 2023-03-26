import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBFxijAY3GWQzdf_JiFJUO2vzhAYkyfHCM", // Add API Key
  databaseURL: "https://beatbounceandscore-default-rtdb.firebaseio.com/",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

var firepadRef = firebase.database().ref();

export const userName = prompt("What's your name?");
const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  firepadRef = firepadRef.child(roomId);
} else {
  firepadRef = firepadRef.push();
  window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
}

export default firepadRef;
