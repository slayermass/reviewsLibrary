import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

app.initializeApp({
  apiKey: "AIzaSyDnNkPSKIcZrUJx3vNYGLDjb9LFIFmYL9w",
  authDomain: "musiclibrary-4980f.firebaseapp.com",
  databaseURL: "https://musiclibrary-4980f.firebaseio.com",
  projectId: "musiclibrary-4980f",
  // storageBucket: '<your-storage-bucket>',
  // messagingSenderId: '<your-sender-id>'
});

// const dbStore = app.firestore();
const auth = app.auth();
app.auth().onAuthStateChanged((user) => {
  console.log(auth.currentUser?.email, user);

  if (user) {
    // User is signed in.
  } else {
    // User is signed out.
  }
});

// авторизация
export const login = (email: string, password: string): Promise<any> =>
  auth.signInWithEmailAndPassword(email, password);
// window.doSignInWithEmailAndPassword = doSignInWithEmailAndPassword;

// https://firebase.google.com/docs/firestore/query-data/listen
// console.log(app, dbStore, doSignInWithEmailAndPassword());
// dbStore
//   .collection("reviews")
//   .orderBy("date", "desc")
//   // .where('group', '==', 'long distance calling')
//   .get()
//   .then((response) => {
//     const data = response.docs.map((i) => ({ id: i.id, ...i.data() }));
//     console.log(data, "вот и данные");
//   });
