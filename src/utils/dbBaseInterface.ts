import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";

export abstract class DbBaseInterface {
  db: any;

  /** авторизация. логин */
  abstract login(email: string, password: string): Promise<unknown>;

  /** обзоры. данные одного обзора */
  abstract getReviewById(id: string): Promise<IReviewItemModel | null>;

  /** обзоры. список. подписка */
  abstract subscribe(email: string): any;

  /** обзоры. создание */
  abstract createReview(model: IReviewForm): Promise<void>;

  /** обзоры. обновление */
  abstract updateReview(id: string, model: IReviewForm): Promise<void>;
}
