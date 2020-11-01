import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import invariant from "invariant";

import { ReviewItemModel } from "models/Review";
import { IReviewListModel } from "models/Review/interfaces";

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
} = process.env;

invariant(
  REACT_APP_FIREBASE_API_KEY ||
    REACT_APP_FIREBASE_AUTH_DOMAIN ||
    REACT_APP_FIREBASE_DATABASE_URL ||
    REACT_APP_FIREBASE_PROJECT_ID,
  "Не заданы необходимые для старта приложения настройки"
);

app.initializeApp({
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: '<your-storage-bucket>',
  // messagingSenderId: '<your-sender-id>'
});

// const dbStore = app.firestore();
export const auth = app.auth();

/** авторизация. логин */
export const login = (email: string, password: string): Promise<any> =>
  auth.signInWithEmailAndPassword(email, password);

/** авторизация. анонимный логин */
export const loginAnonymously = (): Promise<any> => auth.signInAnonymously();

/** обзоры. список */
// export const getReviewsList = (): Promise<IReviewListModel> =>
//   dbStore
//     .collection("reviews")
//     .orderBy("date", "desc")
//     // .where('group', '==', 'long distance calling')
//     .get()
//     .then((response) =>
//       response.docs.map((i) => new ReviewItemModel({ id: i.id, ...i.data() }))
//     );

export const getReviewsList = (): Promise<IReviewListModel> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve([
        new ReviewItemModel({
          album: "testAlbum1",
          comment: "testComment1",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "testGroup1",
          id: "asdasd",
          rating: 3,
        }),
        new ReviewItemModel({
          album: "testAlbum 222",
          comment: "testComment 222",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "testGroup 222",
          id: "dft5445",
          rating: 5,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445sw2da",
          rating: 1,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445swdda",
          rating: 1,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445sbwda",
          rating: 1,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445s9wda",
          rating: 1,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445swd4a",
          rating: 1,
        }),
        new ReviewItemModel({
          album: "---testAlbum 333",
          comment: "---testComment 333",
          date: { nanoseconds: 149000000, seconds: 1604134029 },
          group: "---testGroup 333",
          id: "dft5445swda8",
          rating: 1,
        }),
      ]);
    }, 10);
  });
};

// https://firebase.google.com/docs/firestore/query-data/listen
// console.log(app, dbStore, doSignInWithEmailAndPassword());
