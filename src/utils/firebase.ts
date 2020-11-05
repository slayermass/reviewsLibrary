import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import invariant from "invariant";
import { ReviewItemModel } from "models/Review";
import { IReviewItemModel } from "models/Review/interfaces";

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
});

const dbStore = app.firestore();
export const auth = app.auth();

/** авторизация. логин */
export const login = (email: string, password: string): Promise<unknown> =>
  auth.signInWithEmailAndPassword(email, password);

/** авторизация. анонимный логин */
export const loginAnonymously = (): Promise<any> => auth.signInAnonymously();

/** обзоры. список. обычная загрузка */
// export const getReviewsList = (): Promise<IReviewModel> =>
//   dbStore
//     .collection("reviews")
//     .orderBy("date", "desc")
//     .get()
//     .then((response) =>
//       response.docs.map((i) => new ReviewItemModel({ id: i.id, ...i.data() }))
//     );

/** обзоры. список. подписка */
export const subscribeReviews = (): any =>
  dbStore.collection("reviews").orderBy("date", "desc");

/** обзоры. данные одного обзора */
export const getReviewById = (id: string): Promise<IReviewItemModel | null> =>
  dbStore
    .collection("reviews")
    .doc(id)
    .get()
    .then((response) =>
      response.data() ? new ReviewItemModel(response.data()) : null
    )
    .catch((err) => err);
