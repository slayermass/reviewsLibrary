import {
  IReviewForm,
  IReviewItemModel,
  ReviewListFilterType,
} from "models/Review/interfaces";

export abstract class APIBaseInterface {
  /** авторизация. логин */
  abstract login(email: string, password: string): Promise<unknown>;

  /** проверка авторизованности */
  abstract checkAuth(): Promise<any>;

  /** обзоры. данные одного обзора */
  abstract getReviewById(id: string): Promise<IReviewItemModel | null>;

  /** обзоры. список. подписка */
  abstract subscribe(email: string): any;

  /** обзоры. создание */
  abstract createReview(model: IReviewForm): Promise<any>;

  /** обзоры. обновление */
  abstract updateReview(id: string, model: IReviewForm): Promise<any>;

  /** обзоры. список */
  abstract getList(filter: ReviewListFilterType): Promise<any>;
}
