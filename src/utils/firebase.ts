import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import invariant from "invariant";
import { ReviewItemModel } from "models/Review";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
// import { mockReviewsList } from "utils/mockReviewsList";

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

/** обзоры. список. подписка */
export const subscribeReviews = (email: string): any =>
  dbStore.collection("reviews").where("author", "==", email);

/** обзоры. данные одного обзора */
export const getReviewById = (id: string): Promise<IReviewItemModel | null> =>
  dbStore
    .collection("reviews")
    .doc(id)
    .get()
    .then((response) =>
      response.data()
        ? new ReviewItemModel({ id: response.id, ...response.data() })
        : null
    )
    .catch((err) => err);

/** обзоры. создание */
export const createReview = async (model: IReviewForm): Promise<void> => {
  try {
    const docCreated = await dbStore.collection("reviews").doc();
    return docCreated.set(model);
  } catch (e) {
    return Promise.reject(e);
  }
};

/** обзоры. обновление */
export const updateReview = async (
  docId: string,
  model: IReviewForm
): Promise<void> => dbStore.collection("reviews").doc(docId).set(model);

// MOCK DAA
// export const getReviewsList = (): Promise<any> =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(mockReviewsList), 10);
//   });
