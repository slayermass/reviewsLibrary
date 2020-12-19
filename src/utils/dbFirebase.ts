import app from "firebase";
import invariant from "invariant";
import { ReviewItemModel } from "models/Review";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
import { DbBaseInterface } from "utils/dbBaseInterface";

export class DbFirebase extends DbBaseInterface {
  auth: app.auth.Auth;
  db: app.firestore.Firestore;

  constructor() {
    super();

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

    this.db = app.firestore();
    this.auth = app.auth();
  }

  login(email: string, password: string): Promise<unknown> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  getReviewById(id: string): Promise<IReviewItemModel | null> {
    return this.db
      .collection("reviews")
      .doc(id)
      .get()
      .then((response) =>
        response.data()
          ? new ReviewItemModel({ id: response.id, ...response.data() })
          : null
      )
      .catch((err) => err);
  }

  subscribe(email: string): any {
    return this.db.collection("reviews").where("author", "==", email);
  }

  async createReview(model: IReviewForm): Promise<void> {
    try {
      const docCreated = await this.db.collection("reviews").doc();
      return docCreated.set(model);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  updateReview(id: string, model: IReviewForm): Promise<void> {
    return this.db.collection("reviews").doc(id).set(model);
  }
}
